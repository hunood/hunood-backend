import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import { error } from '../assets/status-codes';
import { t } from '../i18n';
import { Associado, Autenticacao, Usuario } from '../models';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { CryptPassword } from '../assets/crypt-password';
import { Enums } from '../typing';

const UsuarioController = {
    // 1000
    async create(req: Request, res: Response) {
        try {
            const autenticacao = await Autenticacao.findByPk((req as any)?.auth?.id);

            if (!autenticacao) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('USUA1001', t('codes:USUA1001')));
            }

            const usuario = await Usuario.findOne({ where: { cpf: req.body.cpf } })

            if (usuario) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('USUA1002', t('codes:USUA1002')));
            }

            const novo_usuario = await Usuario.create({ id: uuidv4(), ...req.body });

            return res.status(StatusCodes.OK).json(novo_usuario);
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('USUA1003', t('messages:erro-interno', { message: err?.message })));
        };
    },

    // 2000
    async find(req: Request, res: Response) {
        try {
            const { idOuCPf } = req.body;
            const id = uuidValidate(idOuCPf) ? idOuCPf : '00000000-0000-0000-0000-000000000000';
            const cpf = !uuidValidate(idOuCPf) ? idOuCPf : '';

            const usuario = await Usuario.findOne({
                where: {
                    [Op.or]: [{ id }, { cpf }]
                }
            });

            if (!usuario) {
                return res.status(StatusCodes.NOT_FOUND).json(error('USUA2001', t('codes:USUA2001')));
            }

            return res.status(StatusCodes.OK).json(usuario);
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('USUA2002', t('messages:erro-interno', { message: err?.message })));
        }
    },

    async findByBusiness(req: Request, res: Response) {
        try {
            const { id_empresa = '00000000-0000-0000-0000-000000000000' } = req.body;

            // Associação (id_autenticacao, tipo_usuario)
            const associacoes = await Associado.findAll({
                where: { id_empresa }
            });

            // Autenticacao (id_usuario)
            const ids_autenticacoes = associacoes.map(associacao => associacao.id_autenticacao);

            const autenticacoes = await Autenticacao.findAll({
                where: {
                    id: {
                        [Op.in]: ids_autenticacoes
                    }
                }
            });

            // Usuarios
            const ids_usuarios = autenticacoes.map(autenticacao => autenticacao.id_usuario);

            const usuarios = await Usuario.findAll({
                where: {
                    id: {
                        [Op.in]: ids_usuarios
                    }
                }
            });

            const mascararCPF = (cpf: string) => {
                return `${cpf.substr(0, 3)}.***.***-${cpf.substr(-2)}`
            };

            const usuarios_ = associacoes.map(ass_ => {
                const aut_ = autenticacoes.find(autenticacao => autenticacao.id === ass_.id_autenticacao);
                const usu_ = usuarios.find(usuario => usuario.id === aut_.id_usuario);

                delete (usu_ as any).dataValues.createdAt;
                delete (usu_ as any).dataValues.updatedAt;
                usu_.cpf = mascararCPF(usu_.cpf);

                return {
                    email: aut_.email,
                    idAutenticacao: aut_.id,
                    tipo_usuario: ass_.tipo_usuario,
                    nome_usuario: ass_.nome_usuario,
                    usuario_ativo: ass_.usuario_ativo,
                    ultima_atualizacao_associacao: ass_.updatedAt,
                    ...(usu_ as any).dataValues
                };
            });

            return res.status(StatusCodes.OK).json({ usuarios: usuarios_ });
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('USUA2002', t('messages:erro-interno', { message: err?.message })));
        }
    },

    // 3000
    async verifyAssociation(req: Request, res: Response) {
        try {
            const { cpf, email, id_empresa } = req.body;

            const usuario = await Usuario.findOne({ where: { cpf } });
            const cpfExiste = Boolean(usuario);

            let autenticacao: Autenticacao;
            const splitedEmail: string[] = email.split("@");

            if (splitedEmail.length > 1 && splitedEmail[1] === "gmail.com") {
                const likeEmail = `${splitedEmail[0].split(".").join("").split("").join("%")}@${splitedEmail[1]}`;
                autenticacao = await Autenticacao.findOne({
                    where: {
                        email: { [Op.like]: likeEmail }
                    }
                });
            }
            else {
                autenticacao = await Autenticacao.findOne({ where: { email } });
            }

            const emailExiste = Boolean(autenticacao);

            let associacaoEmpresaExiste = false;
            if (cpfExiste) {
                const autenticacoes = await Autenticacao.findAll({ where: { id_usuario: usuario.id } });
                const ids_autenticacoes = autenticacoes.map(aut => aut.id);

                const associacoes = await Associado.findAll({
                    where: {
                        [Op.and]: [
                            { id_empresa },
                            { id_autenticacao: { [Op.in]: ids_autenticacoes } }
                        ]
                    }
                });

                associacaoEmpresaExiste = Boolean(associacoes.length);
            }

            const associacaoExiste = cpfExiste && emailExiste && autenticacao.id_usuario === usuario.id;

            return res.status(StatusCodes.OK).json({
                cpfCadastrado: cpfExiste,
                emailCadastrado: emailExiste,
                associacao: associacaoExiste,
                associadoNaEmpresa: associacaoEmpresaExiste,
            });
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('USUA3002', t('messages:erro-interno', { message: err?.message })));
        }
    },

    // 4000
    async createAndAssociate(req: Request, res: Response) {
        try {
            const [usuario, ehUsuarioNovo] = await Usuario.findOrCreate({
                where: { cpf: req.body.cpf },
                defaults: { id: uuidv4(), nome: req.body.nome, ...req.body }
            });

            let autenticacao: Autenticacao;

            if (!ehUsuarioNovo) {
                autenticacao = await Autenticacao.findOne({ where: { id_usuario: usuario.id } });
            }

            let ehNovoCadastroEmail: boolean;
            if(autenticacao.email.substr(-10) === '@gmail.com') {
                ehNovoCadastroEmail = autenticacao && autenticacao.email?.split('.')?.join('') !== req.body.email?.split('.')?.join('');
            }
            else {
                ehNovoCadastroEmail = autenticacao && autenticacao.email !== req.body.email;
            }

            if (ehUsuarioNovo || ehNovoCadastroEmail) {
                const senha = 'Simb@1822'; // CryptPassword.randomString();
                autenticacao = await Autenticacao.create({
                    id: uuidv4(),
                    etapa_onboarding: Enums.EtapaOnboarding.ALTERACAO_SENHA_NOVO_USUARIO,
                    id_usuario: usuario.id,
                    email_valido: false,
                    email: req.body.email,
                    senha: CryptPassword.encrypt(senha)
                });

                console.log('*************************');
                console.log('SENHA >', senha);
                console.log('*************************');
                // mandar senha por email aqui
            }

            const criarNomeUsuario = (nome: string) => {
                const split = nome.split(" ");

                if (!nome.length || !split.length) {
                    return "usuario";
                }

                if (split.length === 1) {
                    return split[0].toLowerCase();
                }

                if (split.length >= 2) {
                    return split[0].toLowerCase() + "." + split[split.length - 1].toLowerCase();
                }
            };

            const nomeUsuario = criarNomeUsuario(usuario.nome);

            const todosNomesSimilares = await Associado.findAll({
                where: {
                    id_empresa: req.body.id_empresa,
                    nome_usuario: {
                        [Op.startsWith]: nomeUsuario
                    }
                }
            });

            const nomeUsuarioFinal = (associados: Associado[]) => {
                if (nomeUsuario.split(".").length > 1) {
                    const qtd = associados.length;
                    return qtd > 0 ? `${nomeUsuario}${qtd}` : `${nomeUsuario}`;
                }
                else {
                    const qtd = associados.filter(ass => ass.nome_usuario.split(".").length < 2).length;
                    return qtd > 0 ? `${nomeUsuario}${qtd}` : `${nomeUsuario}`;
                }
            };

            const associacao = await Associado.create({
                id_autenticacao: autenticacao.id,
                id_empresa: req.body.id_empresa,
                tipo_usuario: req.body.tipo_usuario,
                nome_usuario: nomeUsuarioFinal(todosNomesSimilares),
                usuario_ativo: true,
            });

            return res.status(StatusCodes.OK).json(associacao);
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('ONBO4001', t('messages:erro-interno', { message: err?.message })));
        };
    }
};

export { UsuarioController };

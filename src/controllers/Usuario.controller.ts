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

    async createAndAssociate(req: Request, res: Response) {
        try {
            const [usuario, ehUsuarioNovo] = await Usuario.findOrCreate({
                where: { cpf: req.body.cpf },
                defaults: { id: uuidv4(), ...req.body }
            });

            let autenticacao: Autenticacao;

            if(!ehUsuarioNovo) {    
                autenticacao = await Autenticacao.findOne({ where: { id_usuario: usuario.id } });
            }
            
            const ehNovoCadastroEmail = autenticacao && autenticacao.email !== req.body.email;

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

            const associacao = await Associado.create({
                id_autenticacao: autenticacao.id,
                id_empresa: req.body.id_empresa,
                tipo_usuario: req.body.tipo_usuario
            });

            return res.status(StatusCodes.OK).json(associacao);
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('ONBO1003', t('messages:erro-interno', { message: err?.message })));
        };
    },

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

    async verifyAssociation(req: Request, res: Response) {
        try {
            const { cpf, email, id_empresa } = req.body;

            const usuario = await Usuario.findOne({ where: { cpf } });
            const cpfExiste = Boolean(usuario);

            const autenticacao = await Autenticacao.findOne({ where: { email } });
            const emailExiste = Boolean(autenticacao);

            const associacaoExiste = cpfExiste && emailExiste && autenticacao.id_usuario === usuario.id;

            const associado = associacaoExiste && await Associado.findOne({
                where: { [Op.and]: [{ id_autenticacao: autenticacao.id }, { id_empresa }] }
            });
            const associacaoEmpresaExiste = Boolean(associado);



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
    }
};

export { UsuarioController };

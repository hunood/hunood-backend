import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error } from '../assets/status-codes';
import { t } from '../i18n';
import { v4 as uuidv4 } from 'uuid';
import { Associado, Autenticacao, Contato, Empresa, Usuario } from '../models';
import { Enums } from '../typing';
import { Email } from '../assets/email';
import { config } from '../config';
import { getHTMLVerificationCode } from '../assets/html/verificationCode';
import tokens from '../assets/token-authentication/tokens';

const OnboardingController = {
    async user(req: Request, res: Response) {
        try {
            const autenticacao = (req as any)?.auth as Autenticacao;

            if (!autenticacao) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('ONBO1001', t('codes:ONBO1001')));
            }

            const existeCpfCadastrado = await Usuario.findOne({ where: { cpf: req.body.cpf } });

            if (existeCpfCadastrado) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('ONBO1002', t('codes:ONBO1002')));
            }

            const novo_usuario = await Usuario.create({ id: uuidv4(), ...req.body });
            const { contatos } = req.body;

            if (novo_usuario) {
                contatos.forEach((contato: Contato) => {
                    contato.id = uuidv4();
                    contato.id_usuario = novo_usuario.id;
                });

                await Contato.bulkCreate(contatos, { returning: true })
            }

            autenticacao.etapa_onboarding = Enums.EtapaOnboarding.CADASTRO_EMPRESA;
            autenticacao.id_usuario = novo_usuario.id;
            autenticacao.save();

            return res.status(StatusCodes.OK).json(novo_usuario);
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('ONBO1003', t('messages:erro-interno', { message: err?.message })));
        };
    },

    async business(req: Request, res: Response) {
        try {
            const autenticacao = (req as any)?.auth as Autenticacao;

            if (!autenticacao) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('ONBO2001', t('codes:ONBO2001')));
            }

            if (req.body.cnpj) {
                const empresa = await Empresa.findOne({ where: { cnpj: req.body.cnpj } })
                if (empresa) {
                    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('ONBO2002', t('codes:ONBO2002')));
                }
            }

            const nova_empresa = await Empresa.create({ id: uuidv4(), ...req.body });
            if (nova_empresa) {
                await Associado.create({
                    id_autenticacao: autenticacao.id,
                    id_empresa: nova_empresa.id,
                    nome_usuario: "master",
                    usuario_ativo: true,
                    tipo_usuario: Enums.TipoUsuario.ADMINISTRADOR
                });

                if (autenticacao.email_valido) {
                    autenticacao.etapa_onboarding = Enums.EtapaOnboarding.COMPLETO;
                }
                else {
                    autenticacao.etapa_onboarding = Enums.EtapaOnboarding.VERIFICACAO_CODIGO_EMAIL;
                }
                autenticacao.save();

                const empresa_ = {
                    id: nova_empresa.id,
                    nomeFantasia: nova_empresa.nome_fantasia,
                    tipo_usuario: Enums.TipoUsuario.ADMINISTRADOR
                };

                return res.status(StatusCodes.OK).json(empresa_);
            }
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('ONBO2003', t('messages:erro-interno', { message: err?.message })));
        };
    },

    async sendCode(req: Request, res: Response) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('ONBO3001', t('codes:ONBO3001')));
            }

            const autenticacao = (req as any)?.auth as Autenticacao;

            if (!autenticacao) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('ONBO3002', t('codes:ONBO1001')));
            }

            const code = await tokens.email.cria(autenticacao.id);

            const feedback = await Email.getInstance()
                .enviar({
                    to: { email },
                    body: getHTMLVerificationCode(code),
                    subject: t('general:assunto-validacao-email'),
                    from: {
                        email: config.email.user,
                        name: t('general:nome-aplicacao')
                    }
                });

            return res.status(StatusCodes.OK).json(feedback);
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('ONBO3003', t('messages:erro-interno', { message: err?.message })));
        };
    },

    async verificationCode(req: Request, res: Response) {
        try {
            const { codigo } = req.body;

            if (!codigo) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('ONBO4001', t('codes:ONBO4001')));
            }

            const autenticacao = (req as any)?.auth as Autenticacao;


            if (!autenticacao) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('ONBO4002', t('codes:ONBO1001')));
            }

            const isValid = await tokens.email.verifica(autenticacao.id, codigo);

            if (!isValid) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('ONBO4003', t('messages:codigo-invalido')));
            }

            autenticacao.email_valido = true;
            autenticacao.etapa_onboarding = Enums.EtapaOnboarding.COMPLETO;
            autenticacao.save();

            await tokens.email.invalida(autenticacao.id);

            return res.status(StatusCodes.OK).json({ emailConfirmado: isValid });
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('ONBO4004', t('messages:erro-interno', { message: err?.message })));
        };
    }
};

export { OnboardingController };
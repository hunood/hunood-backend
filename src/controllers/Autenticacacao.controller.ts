import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { CryptPassword } from '../assets/crypt-password';
import { error } from '../assets/status-codes';
import tokens from '../assets/token-authentication/tokens';
import { t } from '../i18n';

import { Autenticacao, Associado, Usuario, Empresa } from '../models';
import { Enums } from '../typing';

const AutenticacaoController = {
    // 1000
    async create(req: Request, res: Response) {
        try {
            const autenticacao = await Autenticacao.findOne({ where: { email: req.body.email } })

            if (autenticacao) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('AUTE1001', t('codes:AUTE1001')));
            }

            req.body.senha = CryptPassword.encrypt(req.body.senha);

            const nova_autenticacao = await Autenticacao.create({
                id: uuidv4(),
                etapa_onboarding: Enums.EtapaOnboarding.CADASTRO_USUARIO,
                email_valido: false,
                ...req.body
            });

            return res.status(StatusCodes.OK).json({ id: nova_autenticacao.id, createdAt: nova_autenticacao.createdAt });
        }
        catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).json(error('AUTE1002', t('messages:erro-interno', { message: err?.message })));
        };
    },

    // 2000
    async authenticate(req: Request, res: Response) {
        try {
            const { email = '', senha } = req.body;

            // Autenticação
            const autenticacao: Autenticacao = (req as any).auth || await Autenticacao.findOne({ where: { email } });

            if (!autenticacao || !CryptPassword.validate(senha, autenticacao.senha)) {
                return res.status(StatusCodes.FORBIDDEN).json(error('AUTE2001', t('codes:AUTE2001')));
            }

            const { ...autenticacao_ } = (autenticacao as any).dataValues as Autenticacao;
            delete autenticacao_.id_usuario;
            delete autenticacao_.createdAt;
            delete autenticacao_.updatedAt;

            // Usuario
            let usuario_ = null;
            if (autenticacao.etapa_onboarding > Enums.EtapaOnboarding.CADASTRO_USUARIO) {
                const usuario = await Usuario.findOne({ where: { id: autenticacao.id_usuario } });

                if (!usuario) {
                    return res.status(StatusCodes.FORBIDDEN).json(error('AUTE2002', t('codes:AUTE2002')));
                }

                const { ...usuarioProps } = (usuario as any).dataValues as Usuario;
                delete usuarioProps.createdAt;
                delete usuarioProps.updatedAt;
                usuario_ = usuarioProps;
            }

            // Associação e Empresa
            let empresas_ = null;
            if (autenticacao.etapa_onboarding > Enums.EtapaOnboarding.CADASTRO_EMPRESA) {
                const associacoes = (await Associado.findAll({ where: { id_autenticacao: autenticacao.id } }))
                    .map(associacao => {
                        const { id_empresa, tipo_usuario } = associacao;
                        return { id: id_empresa, tipo_usuario: tipo_usuario };
                    });

                const empresas = await Empresa.findAll({
                    where: { id: { [Op.in]: associacoes?.map(a => a.id) } }
                });

                empresas_ = associacoes.map(associacao => {
                    return { ...associacao, nome_fantasia: empresas.find(e => e.id === associacao.id).nome_fantasia };
                });
            }

            // Token
            const accessToken = tokens.access.cria(autenticacao.id);
            const refreshToken = await tokens.refresh.cria(autenticacao.id);
            res.set('Authorization', `Bearer ${accessToken}`);
            res.set('Refresh-Authorization', `Basic ${refreshToken}`);

            const retorno = Object.assign(
                autenticacao_ as Autenticacao,
                { empresas: empresas_ },
                { usuario: usuario_ }
            );

            return res.status(StatusCodes.OK).json(retorno);
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('AUTE2003', t('messages:erro-interno', { message: err?.message })));
        }
    },

    // 3000
    async forbid(req: Request, res: Response) {
        try {
            const { access_token, refresh_token } = req.body;
            let accessToken = req.header('Authorization') || access_token;
            let refreshToken = req.header('Refresh-Authorization') || refresh_token;

            if (accessToken && refreshToken) {
                accessToken = accessToken.split('Bearer')[1].trim();
                refreshToken = refreshToken.split('Basic')[1].trim();

                tokens.access.invalida(accessToken);
                await tokens.refresh.invalida(refreshToken);
            }

            res.status(StatusCodes.NO_CONTENT).json({});
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('AUTE3003', t('messages:erro-interno', { message: err?.message })));
        }
    },

    // 4000
    async refresh(req: Request, res: Response) {
        try {
            const accessToken = tokens.access.cria((req as any).auth.id);
            const refreshToken = await tokens.refresh.cria((req as any).auth.id);

            res.set('Authorization', `Bearer ${accessToken}`);
            res.set('Refresh-Authorization', `Basic ${refreshToken}`);

            res.status(StatusCodes.NO_CONTENT).json({});
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('AUTE4001', err?.message));
        }
    },

    // 5000
    async sendEmailCode(req: Request, res: Response) {
        return res.status(StatusCodes.OK).json({ implements: false });
    },

    // 6000
    async verificationEmailCode(req: Request, res: Response) {
        return res.status(StatusCodes.OK).json({ implements: false });
    },

    // 7000
    async exists(req: Request, res: Response) {
        try {
            const { id_or_email } = req.params;
            const id = uuidValidate(id_or_email) ? id_or_email : '00000000-0000-0000-0000-000000000000';
            const email = !uuidValidate(id_or_email) ? id_or_email : '';

            const autenticacao = await Autenticacao.findOne({ where: { [Op.or]: [{ id }, { email }] } });

            if (!autenticacao) {
                return res.status(StatusCodes.NOT_FOUND).json(error('AUTE7001', t('codes:AUTE7001')));
            }

            return res.status(StatusCodes.OK).json({ existe: true });
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('AUTE7002', t('messages:erro-interno', { message: err?.message })));
        }
    },

    // 8000
    async updateEmail(req: Request, res: Response) {
        try {
            const { email, novo_email } = req.body;
            const autenticacao = await Autenticacao.findOne({ where: { email } });

            if (!autenticacao) {
                return res.status(StatusCodes.NOT_FOUND).json(error('AUTE8001', t('codes:AUTE8001')));
            }

            autenticacao.email = novo_email;
            autenticacao.save();

            return res.status(StatusCodes.OK).json(autenticacao);
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('AUTE8002', t('messages:erro-interno', { message: err?.message })));
        }
    }
}

export { AutenticacaoController };


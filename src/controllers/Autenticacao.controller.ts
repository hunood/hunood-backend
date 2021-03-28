import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { CryptPassword } from '../assets/crypt-password';
import { error } from '../assets/status-codes';
import tokens from '../assets/token-authentication/tokens';
import { t } from '../i18n';

import { Autenticacao } from '../models';

const AutenticacaoController = {
    // 1000
    async create(req: Request, res: Response) {
        const { email_valido = false, etapa_onboarding = 0 } = req.body;

        try {
            const autenticacao = await Autenticacao.findOne({ where: { email: req.body.email } })

            if (autenticacao) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('AUTE1001', t('codes:AUTE1001')));
            }

            req.body.senha = CryptPassword.encrypt(req.body.senha);

            const nova_autenticacao = await Autenticacao.create({ id: uuidv4(), email_valido, etapa_onboarding, ...req.body })
            return res.status(StatusCodes.OK).json({ id: nova_autenticacao.id, createdAt: nova_autenticacao.createdAt });
        }
        catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).json(error('AUTE1002', t('messages:erro-interno', { message: err?.message })));
        };
    },

    // 2000
    async authenticate(req: Request, res: Response) {
        const { email = '', senha } = req.body;

        try {
            const autenticacao = (req as any).auth || await Autenticacao.findOne({ where: { email } });

            if (!autenticacao || !CryptPassword.validate(senha, autenticacao.senha)) {
                return res.status(StatusCodes.FORBIDDEN).json(error('AUTE2001', t('codes:AUTE2001')));
            }

            const accessToken = tokens.access.cria(autenticacao.id);
            const refreshToken = await tokens.refresh.cria(autenticacao.id);

            res.set('Authorization', `Bearer ${accessToken}`);
            res.set('Refresh-Authorization', `Basic ${refreshToken}`);

            return res.status(StatusCodes.OK).json(autenticacao);
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('AUTE2002', t('messages:erro-interno', { message: err?.message })));
        }
    },

    // 3000
    async forbid(req: Request, res: Response) {
        const { access_token, refresh_token } = req.body;
        let accessToken = req.header('Authorization') || access_token;
        let refreshToken = req.header('Refresh-Authorization') || refresh_token;

        try {
            accessToken = accessToken.split('Bearer')[1].trim();
            refreshToken = refreshToken.split('Basic')[1].trim();

            tokens.access.invalida(accessToken);
            await tokens.refresh.invalida(refreshToken);
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
    async find(req: Request, res: Response) {
        let { id, email } = req.body;

        try {
            const refreshToken = req.header('Refresh-Authorization');
            console.log(refreshToken)
            if (!uuidValidate(id) && typeof email === 'string') id = '00000000-0000-0000-0000-000000000000';
            if (uuidValidate(id) && typeof email !== 'string') email = '';

            const autenticacao = await Autenticacao.findOne({ where: { [Op.or]: [{ id }, { email }] } });

            if (!autenticacao) {
                return res.status(StatusCodes.NOT_FOUND).json(error('AUTE7001', t('codes:AUTE7001')));
            }

            return res.status(StatusCodes.OK).json(autenticacao);
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('AUTE7002', t('messages:erro-interno', { message: err?.message })));
        }
    }
}

export { AutenticacaoController };


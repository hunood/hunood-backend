import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import { error } from '../assets/status-codes';
import { t } from '../i18n';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { Autenticacao } from '../models';

const AutenticacaoController = {
    async create(req: Request, res: Response) {
        try {
            const autenticacao = await Autenticacao.findOne({ where: { email: req.body.email } })

            if (autenticacao) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('AUTE1001', t('errors:AUTE1001')));
            }

            const nova_autenticacao = await Autenticacao.create({ id: uuidv4(), ...req.body })
            return res.status(StatusCodes.OK).json(nova_autenticacao);
        }
        catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).json(error('AUTE1002', t('errors:erro-banco', { message: err?.message })));
        };
    },

    async find(req: Request, res: Response) {
        let { id, email } = req.body;

        try {
            if (!uuidValidate(id) && typeof email === 'string') id = '00000000-0000-0000-0000-000000000000';
            if (uuidValidate(id) && typeof email !== 'string') email = '';

            const autenticacao = await Autenticacao.findOne({ where: { [Op.or]: [{ id }, { email }] } });

            if (!autenticacao) {
                return res.status(StatusCodes.NOT_FOUND).json(error('AUTE2001', t('errors:AUTE2001')));
            }

            return res.status(StatusCodes.OK).json(autenticacao);
        }
        catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).json(error('AUTE0002', t('errors:erro-banco', { message: err?.message })));
        }
    },

    async authenticate(req: Request, res: Response) {
        const { email = '', senha } = req.body;

        try {
            const autenticacao = await Autenticacao.findOne({ where: { email } });

            if (!autenticacao || autenticacao.senha != senha) {
                return res.status(StatusCodes.FORBIDDEN).json(error('AUTE3001', t('errors:AUTE3001')));
            }
            return res.status(StatusCodes.OK).json(autenticacao);
        }
        catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).json(error('AUTE3002', t('errors:erro-banco', { message: err?.message })));
        }
    }
};

export { AutenticacaoController };
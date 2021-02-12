import { Request, Response } from 'express'
import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import { error } from '../assets/status-codes';
import { t } from '../i18n';
import { Autenticacao } from '../models';
const { v4: uuidv4 } = require('uuid');

const AutenticacaoController = {
    async create(req: Request, res: Response) {

        const autenticacao = await Autenticacao.findOne({ where: { email: req.body.email } });

        if (autenticacao) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('AUTE0001', t('errors:AUTE0001')));
        }

        Autenticacao.create({ id: uuidv4(), ...req.body })
            .then((nova_autenticacao) => {
                return res.status(StatusCodes.OK).json(nova_autenticacao);
            })
            .catch((e) => {
                return res.status(400).json(error('AUTE0001', t('errors:erro-banco', { message: e.message })))
            });

    },

    async find(req: Request, res: Response) {
        const { id = "00000000-0000-0000-0000-000000000000", email = "" } = req.body;

        const autenticacao = await Autenticacao.findOne({
            where: {
                [Op.or]: [{ id }, { email }]
            }
        });

        if (!autenticacao) {
            return res.status(StatusCodes.NOT_FOUND).json(error('AUTE0002', t('errors:AUTE0002')));
        }

        return res.status(200).json(autenticacao);
    },

    async authenticate(req: Request, res: Response) {
        const { email, senha } = req.body;

        if (typeof email !== 'string' || typeof senha !== 'string') {
            return res.status(StatusCodes.FORBIDDEN).json(error('AUTE0003', t('errors:AUTE0003')));
        }

        const autenticacao = await Autenticacao.findOne({ where: { email } });

        if (!autenticacao) {
            return res.status(StatusCodes.FORBIDDEN).json(error('AUTE0003', t('errors:AUTE0003')));
        }

        if (autenticacao.senha != senha) {
            return res.status(StatusCodes.FORBIDDEN).json(error('AUTE0003', t('errors:AUTE0003')));
        }

        return res.status(StatusCodes.OK).json(autenticacao);
    }
};

export { AutenticacaoController };
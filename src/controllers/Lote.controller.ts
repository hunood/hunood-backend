import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error } from '../assets/status-codes';
import { v4 as uuidv4 } from 'uuid';
import { t } from '../i18n';

import { Autenticacao, Lote } from '../models';

const LoteController = {
    // 1000
    async create(req: Request, res: Response) {
        try {
            const autenticacao = (req as any).auth;

            if (!autenticacao) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('LOTE1001', t('codes:LOTE1001')));
            }

            const novo_lote = await Lote.create({ 
                id: uuidv4(),
                ...req.body 
            });

            return res.status(StatusCodes.OK).json(novo_lote);
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('LOTE1002', t('messages:erro-interno', { message: err?.message })));
        };
    },

    async createAction(req: Request, res: Response) {
        try {
            const autenticacao = (req as any).auth;

            if (!autenticacao) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('LOT21001', t('codes:LOTE1001')));
            }

            const novo_produto = await Lote.create({ 
                id: uuidv4(),
                ...req.body 
            });

            return res.status(StatusCodes.OK).json(novo_produto);
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('LOTE2002', t('messages:erro-interno', { message: err?.message })));
        };
    }
}

export { LoteController };

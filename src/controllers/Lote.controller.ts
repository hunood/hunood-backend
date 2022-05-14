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
            const autenticacao = await Autenticacao.findByPk((req as any)?.auth?.id);

            if (!autenticacao) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('LOTE1001', t('codes:LOTE1001')));
            }

            const novo_produto = await Lote.create({ 
                id: uuidv4(),
                ...req.body 
            });

            return res.status(StatusCodes.OK).json(novo_produto);
        }
        catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).json(error('LOTE1002', t('messages:erro-interno', { message: err?.message })));
        };
    },

    // async find(req: Request, res: Response) {
    //     try {
    //         const { id_empresa } = req.body;

    //         const estoque = await Estoque.findOne({
    //             where: { id_empresa }
    //         });

    //         if (!estoque) {
    //             return res.status(StatusCodes.NOT_FOUND).json(error('USUA2001', t('codes:USUA2001')));
    //         }

    //         return res.status(StatusCodes.OK).json(estoque);
    //     }
    //     catch (err) {
    //         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('USUA2002', t('messages:erro-interno', { message: err?.message })));
    //     }
    // },
}

export { LoteController };

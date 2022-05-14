import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import { error } from '../assets/status-codes';
import { v4 as uuidv4 } from 'uuid';
import { t } from '../i18n';

import { Contato, Estoque } from '../models';

const EstoqueController = {
    // 1000
    // async create(req: Request, res: Response) {
    //     try {
    //         const { estoque, id_empresa } = req.body;

    //         const novo_fornecedor = await Estoque.create({ id: uuidv4(), ...req.body });

    //         if (novo_fornecedor) {
    //             contatos.forEach((contato: Contato) => {
    //                 contato.id = uuidv4();
    //                 contato.id_fornecedor = novo_fornecedor.id;
    //             });

    //             await Contato.bulkCreate(contatos, { returning: true })
    //         }

    //         return res.status(StatusCodes.OK).json({
    //             id: novo_fornecedor.id,
    //             nomeFantasia: novo_fornecedor.nome_fantasia,
    //             createdAt: novo_fornecedor.createdAt
    //         });
    //     }
    //     catch (err) {
    //         return res.status(StatusCodes.BAD_REQUEST).json(error('FORN1001', t('messages:erro-interno', { message: err?.message })));
    //     };
    // },

    async find(req: Request, res: Response) {
        try {
            const { id_empresa } = req.body;

            const estoque = await Estoque.findOne({
                where: { id_empresa }
            });

            if (!estoque) {
                return res.status(StatusCodes.NOT_FOUND).json(error('USUA2001', t('codes:USUA2001')));
            }

            return res.status(StatusCodes.OK).json(estoque);
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('USUA2002', t('messages:erro-interno', { message: err?.message })));
        }
    },
}

export { EstoqueController };

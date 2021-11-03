import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error } from '../assets/status-codes';
import { v4 as uuidv4 } from 'uuid';
import { t } from '../i18n';

import { Contato, Fornecedor } from '../models';

const FornecedorController = {
    // 1000
    async create(req: Request, res: Response) {
        try {
            const { contatos, id_empresa } = req.body;

            const novo_fornecedor = await Fornecedor.create({ id: uuidv4(), id_empresa, ...req.body });

            if (novo_fornecedor) {
                contatos.forEach((contato: Contato) => {
                    contato.id = uuidv4();
                    contato.id_fornecedor = novo_fornecedor.id;
                });

                await Contato.bulkCreate(contatos, { returning: true })
            }

            return res.status(StatusCodes.OK).json({
                id: novo_fornecedor.id,
                nomeFantasia: novo_fornecedor.nome_fantasia,
                createdAt: novo_fornecedor.createdAt
            });
        }
        catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).json(error('AUTE1002', t('messages:erro-interno', { message: err?.message })));
        };
    }
}

export { FornecedorController };

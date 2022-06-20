import { Request, Response } from 'express';
import { Op } from 'sequelize';
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

            const novo_fornecedor = await Fornecedor.create({ id: uuidv4(), ...req.body });

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
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('FORN1001', t('messages:erro-interno', { message: err?.message })));
        };
    },

    async findByBusiness(req: Request, res: Response) {
        try {
            const { id_empresa } = req.body;

            const fornecedores = await Fornecedor.findAll({ where: { id_empresa } });
            const ids_fornecedores = fornecedores.map(forn => forn.id);

            const contatos = await Contato.findAll({
                where: {
                    id_fornecedor: {
                        [Op.in]: ids_fornecedores
                    }
                }
            });

            const fornecedores_ = fornecedores.map(forn => {
                delete (forn as any).dataValues.id_empresa;
                const contatosFilter = contatos.filter(contato => contato.id_fornecedor === forn.id)
                    .map(contato => {
                        return {
                            tipo_contato: contato.tipo_contato,
                            contato: contato.contato.split("_").join("")
                        };
                    });
                return Object.assign((forn as any).dataValues, { contatos: contatosFilter });
            });


            return res.status(StatusCodes.OK).json({ fornecedores: fornecedores_ });
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('FORN1002', t('messages:erro-interno', { message: err?.message })));
        }
    }
}

export { FornecedorController };

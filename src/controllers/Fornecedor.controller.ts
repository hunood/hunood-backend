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

    // 2000
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
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('FORN2001', t('messages:erro-interno', { message: err?.message })));
        }
    },

    // 3000
    async update(req: Request, res: Response) {
        try {
            const { id_empresa, ...dadosFornecedor } = req.body;
            const { dados } = dadosFornecedor;

            const fornecedor = await Fornecedor.findOne({ where: { [Op.and]: [{ id: dados.id }, { id_empresa }] } });

            const [sucesso, _] = await Fornecedor.update(
                { ...dados },
                { where: { [Op.and]: [{ id: dados.id }, { id_empresa }] } }
            );

            if (fornecedor && dados.contatos) {
                await Contato.destroy({ where: { id_fornecedor: fornecedor.id } });

                dados.contatos.forEach((contato: Contato) => {
                    contato.id = uuidv4();
                    contato.id_fornecedor = fornecedor.id;
                });

                await Contato.bulkCreate(dados.contatos, { returning: true })
            }

            if (sucesso) {
                return res.status(StatusCodes.OK).json({ fornecedor: { id: dados.id, id_empresa, ...dados } });
            }

            throw new Error("Fornecedor não pôde ser atualizado.");
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('FORN3001', t('messages:erro-interno', { message: err?.message })));
        };
    },

    // 4000
    async delete(req: Request, res: Response) {
        try {
            const { id_empresa, id_fornecedor } = req.body;
            Contato.destroy({ where: { id_fornecedor }, force: true }).then(async () => {

                await Fornecedor.destroy({ where: { [Op.and]: [{ id: id_fornecedor }, { id_empresa }] }, force: true })
                return res.status(StatusCodes.OK).json({ sucesso: true })
            })
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('FORN4001', t('messages:erro-interno', { message: err?.message })));
        };
    }
}

export { FornecedorController };

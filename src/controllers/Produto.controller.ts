import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import { error } from '../assets/status-codes';
import { Enums } from '../typing';
import { v4 as uuidv4 } from 'uuid';
import { t } from '../i18n';

import { Autenticacao, Empresa, Estoque, Produto, Lote } from '../models';
import { connection } from '../database';

const ProdutoController = {
    // 1000
    async create(req: Request, res: Response) {

        const transaction = await connection.transaction();

        try {
            const { id_empresa } = req.body;

            const autenticacao = (req as any).auth;

            if (!autenticacao) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('PROD1001', t('codes:PROD1001')));
            }

            const empresa = await Empresa.findOne({
                where: { id: id_empresa }
            });

            if (!empresa) {
                return res.status(StatusCodes.NOT_FOUND).json(error('PROD1002', t('codes:PROD1002')));
            }

            const novo_produto = await Produto.create({
                id: uuidv4(),
                codigo: req.body.codigo,
                id_empresa,
                ...req.body
            }, {
                transaction
            });

            if (req.body.quantidade > 0) {
                const { data_fabricacao, data_validade, observacoes, codigo_lote, quantidade } = req.body;
                const lote = await Lote.create({
                    id: uuidv4(),
                    id_empresa,
                    observacoes,
                    data_fabricacao,
                    data_validade,
                    codigo: codigo_lote,
                    id_produto: novo_produto.id,
                    quantidade_produtos:quantidade
                }, {
                    transaction
                });

                if (!lote) {
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('PROD1003', t('codes:PROD1003')));
                }

                const estoque = await Estoque.create({
                    id: uuidv4(),
                    id_empresa,
                    id_autenticacao: (req as any)?.auth?.id,
                    id_produto: novo_produto.id,
                    id_lote: lote.id,
                    tipo_acao: Enums.TipoAcaoEstoque.ENTRADA,
                    data_acao: new Date()
                }, {
                    transaction
                });

                if (!estoque) {
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('PROD1004', t('codes:PROD1004')));
                }
            }

            await transaction.commit();
            return res.status(StatusCodes.OK).json(novo_produto);
        }
        catch (err) {
            await transaction.rollback();
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('PROD1005', t('messages:erro-interno', { message: err?.message })));
        };
    },

    // 2000
    async find(req: Request, res: Response) {
        try {
            const { id_empresa } = req.body;

            const produto = await Produto.findOne({
                where: { id_empresa }
            });

            if (!produto) {
                return res.status(StatusCodes.NOT_FOUND).json(error('PROD2001', t('codes:PROD2001')));
            }

            return res.status(StatusCodes.OK).json(produto);
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('PROD2002', t('messages:erro-interno', { message: err?.message })));
        }
    },

    async findAll(req: Request, res: Response) {
        try {
            const { id_empresa } = req.body;

            const produtos = await Produto.findAll({ where: { id_empresa }, raw: true });
            const ids_produtos = produtos.map(p => p.id);

            const estoques = await Estoque.findAll({ where: { id_produto: { [Op.in]: ids_produtos } }, raw: true });
            const lotes = await Lote.findAll({ where: { id_produto: { [Op.in]: ids_produtos } }, raw: true });

       
            const pts = ids_produtos.map((id) => {
                const produto = produtos.find(p => p.id === id);
                produto["estoques"] = estoques.filter(e => e.id_produto === id);
                produto["lotes"] = lotes.filter(l => l.id_produto === id).filter(l => Array.isArray(l) !== true);
                return produto;
            });

            return res.status(StatusCodes.OK).json({ produtos: pts });
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('PROD3002', t('messages:erro-interno', { message: err?.message })));
        }
    }
}

export { ProdutoController };

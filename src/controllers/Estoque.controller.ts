import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error } from '../assets/status-codes';
import { v4 as uuidv4 } from 'uuid';
import { t } from '../i18n';

import { Estoque, Lote, Produto } from '../models';
import { connection } from '../database';

const EstoqueController = {
    // 1000
    async create(req: Request, res: Response) {

        const transaction = await connection.transaction();

        try {
            const { id_empresa, id_produto, tipo_acao } = req.body;

            const autenticacao = (req as any).auth;

            if (!autenticacao) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('ESTO1001', t('codes:ESTO1001')));
            }

            let lote_: Lote, estoque_: Estoque, produto_: Produto;

            const ehEntrada = req.body.tipo_acao === "ENTRADA";
            const ehLoteNovo = req.body.lote.eh_lote_novo;

            // Lote
            if(ehEntrada && ehLoteNovo) {
                lote_ = await Lote.create({...req.body.lote, id: uuidv4(), id_produto}, {
                    transaction
                });

                if (!lote_) {
                    return res.status(StatusCodes.BAD_REQUEST).json(error('ESTO1002', t('codes:ESTO1002')));
                }
            }
            else {
                lote_ = await Lote.findByPk(req.body.lote.id);

                if (!lote_) {
                    return res.status(StatusCodes.NOT_FOUND).json(error('ESTO1003', t('codes:ESTO1003')));
                }
            }

            // Estoque
            if (lote_.id) {
                const est = {
                    id: uuidv4(),
                    id_empresa: id_empresa,
                    id_lote: lote_.id,
                    id_autenticacao: req.body.id_autenticacao,
                    id_produto: req.body.id_produto,
                    tipo_acao: req.body.tipo_acao,
                    data_acao: req.body.data_acao
                };
                
                estoque_ = await Estoque.create(est, { transaction });

                if (!estoque_) {
                    return res.status(StatusCodes.BAD_REQUEST).json(error('ESTO1004', t('codes:ESTO1004')));
                }
            }

            if (id_produto) {
                produto_ = await Produto.findByPk(id_produto);

                if (!produto_) {
                    return res.status(StatusCodes.NOT_FOUND).json(error('ESTO1005', t('codes:ESTO1005')));
                }
            }

            // ENTRADA E SAÍDA
            if (tipo_acao === 'ENTRADA') {
                const valor = req.body.quantidade_acao;
                Produto.increment({ quantidade: valor }, { where: { id: produto_.id } });
                if(!ehLoteNovo) {
                    Lote.increment({ quantidade_produtos: valor }, { where: { id: lote_.id } });
                }
            }
            else {
                const valor = -1 * req.body.quantidade_acao;
                Lote.increment({ quantidade_produtos: valor }, { where: { id: lote_.id } });
                Produto.increment({ quantidade: valor }, { where: { id: produto_.id } });
            }

            await transaction.commit();
            return res.status(StatusCodes.OK).json({ estoque: req.body.estoque, lote: req.body.lote, produto: req.body.produto });
        }
        catch (err) {
            await transaction.rollback();
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('ESTO1006', t('messages:erro-interno', { message: err?.message })));
        };
    },

    async find(req: Request, res: Response) {
        try {
            const { id_empresa } = req.body;

            const estoque = await Estoque.findOne({
                where: { id_empresa }
            });

            if (!estoque) {
                return res.status(StatusCodes.NOT_FOUND).json(error('ESTO2001', t('codes:ESTO2001')));
            }

            return res.status(StatusCodes.OK).json(estoque);
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('ESTO2002', t('messages:erro-interno', { message: err?.message })));
        }
    },
}

export { EstoqueController };

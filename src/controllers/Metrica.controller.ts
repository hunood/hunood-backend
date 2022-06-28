import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import { error } from '../assets/status-codes';
import { v4 as uuidv4 } from 'uuid';
import { t } from '../i18n';

import { Associado, Estoque, Lote, Produto } from '../models';

const MetricaController = {
    // 1000
    async actions(req: Request, res: Response) {
        try {
            const autenticacao = (req as any).auth;

            if (!autenticacao) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('LOTE1001', t('codes:LOTE1001')));
            }

            const { id_empresa } = req.body;

            const estoques = await Estoque.findAll({ where: { id_empresa }, raw: true })
            const ids_autenticacoes = Array.from(new Set(estoques.map(e => e.id_autenticacao)));
            const ids_produtos = Array.from(new Set(estoques.map(e => e.id_produto)));

            const associados = await Associado.findAll({ where: { id_autenticacao: { [Op.in]: ids_autenticacoes } }, raw: true });
            const produtos = await Produto.findAll({ where: { id: { [Op.in]: ids_produtos } }, raw: true });

            estoques.forEach((estoque) => {
                (estoque as any).usuario = associados.find(associado => associado.id_autenticacao === estoque.id_autenticacao);
                (estoque as any).produto = produtos.find(produto => produto.id === estoque.id_produto);
            });

            return res.status(StatusCodes.OK).json({ metricas: estoques });
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('LOTE1002', t('messages:erro-interno', { message: err?.message })));
        };
    },

    // 2000
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
    },

    // 3000
    async update(req: Request, res: Response) {
        try {
            const { id, id_produto, ...dados } = req.body;

            const [sucesso, _] = await Lote.update(
                { ...dados },
                { where: { [Op.and]: [{ id }, { id_produto }] } }
            );

            if (sucesso) {
                return res.status(StatusCodes.OK).json({ id, id_produto, ...dados });
            }

            throw new Error("Lote não pôde ser atualizado.");
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('LOTE3001', t('messages:erro-interno', { message: err?.message })));
        };
    }
}

export { MetricaController };

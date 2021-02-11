import {Request, Response, NextFunction} from 'express'
const { v4: uuidv4 } = require('uuid');
import { error } from '../assets/status-code';
import { Autenticacao } from '../models';

// import { jwt } from 'jsonwebtoken';
// var jwt = require('jsonwebtoken');

const AutenticacaoController = {
    async create(req: Request, res: Response) {
        const { email, senha, email_valido } = req.body;

        const autenticacao = await Autenticacao.findOne({ where: { email } });

        if (autenticacao) {
            return res.status(400).json({ error: 'Email já utilizado!' });
        }

        const nova_autenticacao = await Autenticacao.create({
            id: uuidv4(),
            email,
            senha,
            email_valido
        });

        return res.status(200).json(nova_autenticacao);
    },

    async exists(req: Request, res: Response) {
        const { email } = req.params;

        const autenticacao = await Autenticacao.findOne({ where: { email } });

        if (!autenticacao) {
            return res.status(400).json({  message: 'Email não encontrado!' });
        }

        return res.status(200).json({ 
            success: true 
        });
    },

    async authenticate(req: Request, res: Response) {
        const { email, senha } = req.body;

        const autenticacao = await Autenticacao.findOne({ where: { email } });

        if (!autenticacao) {
            return res.status(400).json(error('A001', 'sdas'));
        }

        if (autenticacao.senha != senha) {
            return res.status(400).json({ message: 'Autenticação inválida!' });
        }

        delete (autenticacao as any).dataValues.senha;
        return res.status(200).json(autenticacao);
    }
};

export { AutenticacaoController };
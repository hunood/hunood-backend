import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import { error } from '../assets/status-codes';
import { t } from '../i18n';
import { Autenticacao, Usuario } from '../models';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

const UsuarioController = {
    async create(req: Request, res: Response) {
        const erroBanco = (err) => {
            return res.status(StatusCodes.BAD_REQUEST).json(error('USUA0001', t('errors:erro-banco', { message: err?.message })));
        };

        try {
            const autenticacao = await Autenticacao.findByPk(req.body.id_autenticacao);

            if(!autenticacao) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('USUA0001', t('errors:USUA0001')));
            }

            const usuario = await Usuario.findOne({ where: { cpf: req.body.cpf } })

            if (usuario) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('USUA0001', t('errors:USUA0002')));
            }
            try {
                const novo_usuario = await Usuario.create({ id: uuidv4(), ...req.body })
                return res.status(StatusCodes.OK).json(novo_usuario);
            }
            catch (err) { erroBanco(err); }
        }
        catch (err) { erroBanco(err); };
    },

    async find(req: Request, res: Response) {
        let { id, cpf } = req.body;

        try {
            if (!uuidValidate(id) && typeof cpf === 'string') id = '00000000-0000-0000-0000-000000000000';
            if (uuidValidate(id) && typeof cpf !== 'string') cpf = '';

            const usuario = await Usuario.findOne({ where: { [Op.or]: [{ id }, { cpf }] } });

            if (!usuario) {
                return res.status(StatusCodes.NOT_FOUND).json(error('USUA0002', t('errors:USUA0002')));
            }

            return res.status(StatusCodes.OK).json(usuario);
        }
        catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).json(error('USUA0002', t('errors:erro-banco', { message: err?.message })));
        }
    }
};

export { UsuarioController };
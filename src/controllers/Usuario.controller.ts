import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import { error } from '../assets/status-codes';
import { t } from '../i18n';
import { Autenticacao, Usuario } from '../models';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

const UsuarioController = {
    async create(req: Request, res: Response) {
        try {
            const autenticacao = await Autenticacao.findByPk((req as any)?.auth?.id);

            if (!autenticacao) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('USUA1001', t('codes:USUA1001')));
            }

            const usuario = await Usuario.findOne({ where: { cpf: req.body.cpf } })

            if (usuario) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('USUA1002', t('codes:USUA1002')));
            }

            const novo_usuario = await Usuario.create({ id: uuidv4(), ...req.body });

            return res.status(StatusCodes.OK).json(novo_usuario);
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('USUA1003', t('messages:erro-interno', { message: err?.message })));
        };
    },

    async find(req: Request, res: Response) {
        const { idOrCpf } = req.params;

        try {
            const id = uuidValidate(idOrCpf) ? idOrCpf : '00000000-0000-0000-0000-000000000000';
            const cpf = !uuidValidate(idOrCpf) ? idOrCpf : '';

            const usuario = await Usuario.findOne({ where: { [Op.or]: [{ id }, { cpf }] } });

            if (!usuario) {
                return res.status(StatusCodes.NOT_FOUND).json(error('USUA2001', t('codes:USUA2001')));
            }

            return res.status(StatusCodes.OK).json(usuario);
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('USUA2002', t('messages:erro-interno', { message: err?.message })));
        }
    }
};

export { UsuarioController };

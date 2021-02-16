import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import { error } from '../assets/status-codes';
import { t } from '../i18n';
import { validate as uuidValidate } from 'uuid';
import { Autenticacao,  } from '../models';

const EmpresaController = {
    async find(req: Request, res: Response) {
        let { id, cpf } = req.body;

        try {
            if (!uuidValidate(id) && typeof cpf === 'string') id = '00000000-0000-0000-0000-000000000000';
            if (uuidValidate(id) && typeof cpf !== 'string') cpf = '';

            const usuario = await Autenticacao.findOne({ where: { [Op.or]: [{ id }, { cpf }] } });

            if (!usuario) {
                return res.status(StatusCodes.NOT_FOUND).json(error('EMPR1001', t('errors:EMPR1001')));
            }

            return res.status(StatusCodes.OK).json(usuario);
        }
        catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).json(error('EMPR1002', t('errors:erro-banco', { message: err?.message })));
        }
    }
};

export { EmpresaController };
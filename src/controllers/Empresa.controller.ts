import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import { error } from '../assets/status-codes';
import { t } from '../i18n';
import { validate as uuidValidate } from 'uuid';
import { Empresa, } from '../models';

const EmpresaController = {
    async find(req: Request, res: Response) {
        let { id, cnpj } = req.body;

        try {
            if (!uuidValidate(id) && typeof cnpj === 'string') id = '00000000-0000-0000-0000-000000000000';
            if (uuidValidate(id) && typeof cnpj !== 'string') cnpj = '';

            const empresa = await Empresa.findOne({ where: { [Op.or]: [{ id }, { cnpj }] } });

            if (!empresa) {
                return res.status(StatusCodes.NOT_FOUND).json(error('EMPR1001', t('codes:EMPR1001')));
            }

            return res.status(StatusCodes.OK).json(empresa);
        }
        catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).json(error('EMPR1002', t('messages:erro-banco', { message: err?.message })));
        }
    }
};

export { EmpresaController };
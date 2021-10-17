import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';
import { error } from '../assets/status-codes';
import { t } from '../i18n';

import { Associado } from '../models';

const AssociadoController = {
    // 1000
    async update(req: Request, res: Response) {
        try {
            const { id_autenticacao, id_empresa, dados } = req.body;

            const [sucesso, _] = await Associado.update(
                { ...dados },
                { where: { [Op.and]: [{ id_autenticacao }, { id_empresa }] } }
            );

            if(sucesso) {
                return res.status(StatusCodes.OK).json({id_autenticacao, id_empresa, ...dados});
            }

            throw new Error("Associação não pôde ser atualizada.");
        }
        catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).json(error('AUTE1002', t('messages:erro-interno', { message: err?.message })));
        };
    }
}

export { AssociadoController };


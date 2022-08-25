import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import { error } from '../assets/status-codes';
import { t } from '../i18n';
import { validate as uuidValidate } from 'uuid';
import { Associado, Empresa, } from '../models';

const EmpresaController = {
    async find(req: Request, res: Response) {
        try {
            let { id, cnpj } = req.body;

            if (!uuidValidate(id) && typeof cnpj === 'string') id = '00000000-0000-0000-0000-000000000000';
            if (uuidValidate(id) && typeof cnpj !== 'string') cnpj = '';

            const empresa = await Empresa.findOne({ where: { [Op.or]: [{ id }, { cnpj }] } });

            if (!empresa) {
                return res.status(StatusCodes.NOT_FOUND).json(error('EMPR1001', t('codes:EMPR1001')));
            }

            return res.status(StatusCodes.OK).json(empresa);
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('EMPR1002', t('messages:erro-interno', { message: err?.message })));
        }
    },

    async findByUser(req: Request, res: Response) {
        try {
            const { id_autenticacao } = req.body;

            const associacoes = (await Associado.findAll({ where: { id_autenticacao, usuario_ativo: true } }))
                .map(associacao => {
                    const { id_empresa, tipo_usuario, nome_usuario } = associacao;
                    return { id: id_empresa, tipo_usuario, nome_usuario };
                });


            const empresas = await Empresa.findAll({
                where: { id: { [Op.in]: associacoes?.map(a => a.id) } }
            });

            const empresas_ = associacoes.map(associacao => {
                return { ...associacao, nome_fantasia: empresas.find(e => e.id === associacao.id).nome_fantasia };
            });

            return res.status(StatusCodes.OK).json({ empresas: empresas_ });
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error('EMPR1002', t('messages:erro-interno', { message: err?.message })));
        }
    }
};

export { EmpresaController };
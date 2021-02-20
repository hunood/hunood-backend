import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error } from '../assets/status-codes';
import { t } from '../i18n';
import { v4 as uuidv4 } from 'uuid';
import { Associado, Autenticacao, Empresa, Usuario } from '../models';

const OnboardingController = {
    async user(req: Request, res: Response) {
        try {
            const autenticacao = await Autenticacao.findByPk(req.body.id_autenticacao);

            if (!autenticacao) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('ONBO1001', t('codes:ONBO1001')));
            }

            const usuario = await Usuario.findOne({ where: { cpf: req.body.cpf } })

            if (usuario) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('ONBO1002', t('codes:ONBO1002')));
            }

            const novo_usuario = await Usuario.create({ id: uuidv4(), ...req.body });

            autenticacao.etapa_onboarding = 1;
            autenticacao.save();

            return res.status(StatusCodes.OK).json(novo_usuario);

        }
        catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).json(error('ONBO1003', t('messages:erro-banco', { message: err?.message })));
        };
    },

    async business(req: Request, res: Response) {
        try {
            const autenticacao = await Autenticacao.findByPk(req.body.id_autenticacao);
            if (!autenticacao) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('ONBO2001', t('codes:ONBO2001')));
            }

            const empresa = await Empresa.findOne({ where: { cnpj: req.body.cnpj } })
            if (empresa) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('ONBO2002', t('codes:ONBO2002')));
            }

            const nova_empresa = await Empresa.create({ id: uuidv4(), ...req.body });
            if (nova_empresa) {
                await Associado.create({
                    id_autenticacao: autenticacao.id,
                    id_empresa: nova_empresa.id,
                    usuario_primario: true
                });

                autenticacao.etapa_onboarding = 2;
                autenticacao.save();

                return res.status(StatusCodes.OK).json(nova_empresa);
            }
        }
        catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).json(error('ONBO2003', t('messages:erro-banco', { message: err?.message })));
        };
    }
};

export { OnboardingController };
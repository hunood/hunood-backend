import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error } from '../assets/status-codes';
import { t } from '../i18n';

import axios from 'axios';

interface ResponseCEP {
    cep: string,
    logradouro: string,
    complemento: string,
    bairro: string,
    localidade: string,
    uf: string,
    ibge: string,
    gia: string,
    ddd: string,
    siafi: string,
    erro?: boolean
}

const CEPController = {
    async find(req: Request, res: Response) {
        const { cep } = req.params;
        try {
            const dados_logradouro = await axios.get<ResponseCEP>(`https://viacep.com.br/ws/${cep}/json/`);
            
            if (dados_logradouro.data.erro) {
                return  res.status(StatusCodes.NOT_FOUND).json(error('CODP1001', t('codes:CODP1001')));
            }
            
            return res.status(StatusCodes.OK).json(dados_logradouro.data);
        }
        catch (err) {
            if (err?.response?.status === StatusCodes.BAD_REQUEST ){
                return  res.status(StatusCodes.BAD_REQUEST).json(error('CODP1002', t('codes:CODP1002')));
            }
            return  res.status(StatusCodes.SERVICE_UNAVAILABLE).json(error('CODP1003', t('codes:CODP1003')));
        };
    },
};

export { CEPController };
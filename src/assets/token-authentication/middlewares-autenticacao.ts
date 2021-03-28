import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { t } from "../../i18n";
import { Autenticacao } from "../../models";
import { error } from "../status-codes";
import tokens from './tokens';

const getUsuario = async (id: any, res: Response) => {
  if (id && id.name === 'JsonWebTokenError' || id.name === 'TokenExpiredError') {
    return res.status(StatusCodes.UNAUTHORIZED).json(error(id?.inner.message, id?.message));
  }

  const autenticacao = await Autenticacao.findByPk(id);

  if (!autenticacao) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(error('MTOK1001', t('codes:MTOK1001')));
  }

  return autenticacao;
}

export default {
  async bearer(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.header('Authorization')?.split('Bearer')[1]?.trim();

      if (!accessToken) {
        return res.status(StatusCodes.IM_A_TEAPOT).json(error('MTOK2001', t('codes:MTOK2001')));
      }

      const id = await tokens.access.verifica(accessToken);
      (req as any).auth = await getUsuario(id, res);
      next();
    }
    catch (error) {

    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.header('Refresh-Authorization').split('Basic')[1].trim();

    if (!refreshToken) {
      return res.status(StatusCodes.IM_A_TEAPOT).json(error('MTOK3001', t('codes:MTOK3001')));
    }

    const id = await tokens.refresh.verifica(refreshToken);
    (req as any).auth = await getUsuario(id, res);
    await tokens.refresh.invalida(refreshToken);
    return next();
  },
};

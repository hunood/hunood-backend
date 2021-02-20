import { Request, Response, NextFunction } from 'express'
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { BaseRoute } from '../typing/enums';
import { Error } from '../typing/interfaces';
import { t } from '../i18n';
import { config } from '../config';
import { createClient } from 'redis';
import jwt from 'jsonwebtoken';

const redis = createClient(config.redis);

const getResponse = (statusCode: typeof StatusCodes | number, data: any, error?: Error) => {
    if (error) {
        return {
            code: error.code,
            message: error.message,
            status: `${statusCode} - ${getReasonPhrase(statusCode as unknown as number)}`,
        }
    }

    return data;
};

const error = (code: string, message: string): Error => {
    return { code, message };
};

const status = (_: Request, res: Response, next: NextFunction) => {
    const json = res.json;
    (res as any).json = function (obj: any) {
        if ('/' + res.req.originalUrl.split('/')[1] === BaseRoute.authentication) {
            delete obj?.dataValues?.senha
        }

        const keysOfObj = Object.keys(obj);

        if (res.statusCode >= 400) {
            if (keysOfObj.length >= 2 && keysOfObj[0] === 'code' && keysOfObj[1] === 'message') {
                if (res.statusCode === 400) {
                    const split = obj.message.split('of relation');
                    obj.message = split.length == 2 ? split[0].replace('in column', 'in the') + 'parameter' : obj.message;
                }
                json.call(this, getResponse(res.statusCode, undefined, obj));
            }
            else {
                json.call(this, { error: t('messages:nao-tratado'), route: res.req.originalUrl });
            }
        } else {
            json.call(this, getResponse(res.statusCode, obj));
        }
    };
    next();
}

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['x-access-token'] as string;
    if (!token) return res.status(StatusCodes.UNAUTHORIZED).json(error('TOKE1001', t('codes:TOKE1001')));

    redis.get(token, (_, jwt_redis) => {

        jwt.verify(token, config.jwt.secret, function (err, decoded: { id: string }) {

            if (err || decoded.id !== jwt_redis) {
                return res.status(StatusCodes.UNAUTHORIZED).json(error('TOKE1002', t('codes:TOKE1002')));
            }

            (req as any).params.id_autenticacao = decoded.id;
            next();
        });

    });
}

export { status, error, verifyJWT };
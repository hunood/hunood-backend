import { Request, Response, NextFunction } from 'express'
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { Util } from './utils';
import { BaseRoute } from '../typing/enums';
import { Error } from '../typing/interfaces';
import { t } from '../i18n';

const getResponse = (statusCode: typeof StatusCodes | number, data: any, error?: Error) => {
    if (error) {
        if (process.env.ENVIRONMENT !== 'production') {
            return {
                code: error.code,
                message: error.message,
                status: `${statusCode} - ${getReasonPhrase(statusCode as unknown as number)}`,
                error: true
            }
        }

        return {
            message: error.message,
            error: true
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
            delete obj?.senha;
            delete obj?.dataValues?.senha;
        }

        if (obj?.dataValues) obj.dataValues = Util.attributesSnakeToCamelCase(obj.dataValues);
        else obj = Util.attributesSnakeToCamelCase(obj);

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
                if (process.env.ENVIRONMENT !== 'production') {
                    json.call(this, { error: t('messages:nao-tratado'), route: res.req.originalUrl, obj });
                }
                else {
                    json.call(this, { error: t('messages:nao-tratado'), route: res.req.originalUrl });
                }
            }
        } else {
            json.call(this, getResponse(res.statusCode, obj));
        }
    };
    next();
}

export { status, error };

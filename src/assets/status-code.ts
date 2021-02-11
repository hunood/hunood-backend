import {Request, Response, NextFunction} from 'express'
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { BaseRoute } from '../typing/enums';
import { Error } from '../typing/interfaces';
import { t } from '../i18n';

const getStatus = (code: typeof StatusCodes | number, error?: Error) => {
    return {
        error: error.code,
        message: error.message,
        code: `${code} - ${getReasonPhrase(code as unknown as number)}`,
    };
};

const error = (code: string, message: string): Error => {
    return { code, message };
};

const status = (_: Request, res: Response, next: NextFunction) => {
    const json = res.json;
    (res as any).json = function (obj) {
        if ('/' + res.req.originalUrl.split('/')[1] === BaseRoute.authentication) {
            delete obj?.dataValues?.senha
        }

        const keys = Object.keys(obj);

        if (res.statusCode >= 400) {
            if (keys.length === 2 && keys[0] === 'code' && keys[1] === 'message') {
                json.call(this, { status: getStatus(res.statusCode, obj) });
            }

            json.call(this, { error: t('errors:nao-tratado'), route: res.req.originalUrl });
            
        } else {
            json.call(this, Object.assign({ data: obj }, { status: getStatus(res.statusCode, obj) }));
        }
    };
    next();
}

export { status, error };
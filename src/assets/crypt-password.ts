import { config } from '../config';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

class CryptPassword {
    static encrypt = (senha: string): string => {
        const salt = bcrypt.genSaltSync(config.auth.salt);
        return bcrypt.hashSync(senha + config.auth.password, salt);
    }

    static validate = (senha: string, senhaCodificada): boolean => {
        return bcrypt.compareSync(senha + config.auth.password, senhaCodificada);
    }

    static getTokenOpaque = () => {
        return crypto.randomBytes(24).toString('hex');
    }

    static randomString = (tamanho: number = 8, chars: string = 'A1') => {
        let mask = '';
        if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (chars.indexOf('1') > -1) mask += '0123456789';
        if (chars.indexOf('#') > -1) mask += '!@#$%&';
        let result = '';
        for (let i = tamanho; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
        return result;
    }
}

export { CryptPassword }
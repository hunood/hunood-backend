import { Languages } from './enums';
import { Options } from 'sequelize';
import { Algorithm } from 'jsonwebtoken';

interface Config {
    environment: 'production' | 'development',
    language: typeof Languages | string,
    appName: string,
    baseUrl: string,
    port: number,
    database: Options,
    redis: {
        host: string,
        port: number,
        password: string
    },
    jwt: {
        secret: string,
        expiresIn: number,
        algorithm?: Algorithm
    },
    email: {
        user: string,
        password: string,
        service?: string,
        host?: string,
        port?: number
    }
}

interface Error {
    code: string,
    message: string
}

export { Config, Error };
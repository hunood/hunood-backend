import { Languages } from './enums';
import { Options } from 'sequelize';

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
import { Languages } from './enums';

interface Config {
    environment: 'production' | 'development',
    language: typeof Languages | string,
    appName: string,
    baseUrl: string,
    port: number,
    redis: {
        host: string,
        port: string,
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
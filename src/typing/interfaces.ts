import { Languages } from './enums';

interface Config {
    environment: 'prod' | 'dev',
    language: typeof Languages | string,
    appName: string,
    baseUrl: string,
    port: number,
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
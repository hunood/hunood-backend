import { languagesTypes } from "./types/languages";

interface IConfig {
    environment: 'prod' | 'dev',
    language: typeof languagesTypes | string,
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

export const config: IConfig = {
    environment: process.env.ENVIRONMENT === 'prod' ? 'prod' : 'dev',
    language: languagesTypes.portuguese_br,
    appName: 'Hunood Backend',
    baseUrl: 'http://localhost:3001',
    port: 3001,
    email: {
        user: 'hunood.web@gmail.com',
        password: 'Hunood@1822',
        service: 'Gmail'
    }
};


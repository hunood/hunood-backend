import { Config } from "./typing/interfaces";
import { Languages } from "./typing/enums";

export const config: Config = {
    environment: process.env.ENVIRONMENT === 'prod' ? 'prod' : 'dev',
    language: Languages.portuguese_br,
    appName: 'Hunood Backend',
    baseUrl: 'http://localhost:3001',
    port: 3001,
    email: {
        user: 'hunood.web@gmail.com',
        password: 'Hunood@1822',
        service: 'Gmail'
    }
};
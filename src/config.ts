import { Config } from "./typing/interfaces";
import { Languages } from "./typing/enums";

export const config: Config = {
    environment: process.env.ENVIRONMENT === 'production' ? 'production' : 'development',
    language: Languages.portuguese_br,
    appName: 'Hunood Backend',
    baseUrl: process.env.BASEURL || 'http://localhost:3001/',
    port: Number(process.env.PORT) || 3001,
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    },
    email: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        service: process.env.EMAIL_SERVICE
    }
};
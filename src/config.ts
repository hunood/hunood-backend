import { Config } from "./typing/interfaces";
import { Languages } from "./typing/enums";
import dbconfig from "./config.database";

const REDIS_URL = process.env.REDIS_URL.split(':');

export const config: Config = {
    environment: process.env.ENVIRONMENT === 'production' ? 'production' : 'development',
    language: Languages.portuguese_br,
    appName: 'Hunood Backend',
    baseUrl: process.env.BASEURL || 'http://localhost:3001/',
    port: Number(process.env.PORT) || 3001,
    database: dbconfig,
    redis: {
        password: REDIS_URL[2].split('@')[0],
        host: REDIS_URL[2].split('@')[1],
        port: Number(REDIS_URL[3].split('/')[0]),
    },
    email: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        service: process.env.EMAIL_SERVICE
    }
};
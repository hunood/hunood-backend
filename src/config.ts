import { Config } from "./typing/interfaces";
import { Languages } from "./typing/enums";
import dbconfig from "./config.database";

const environment = process.env.ENVIRONMENT === "production" ? "production" : "development";
const REDIS_URL = process.env.REDISCLOUD_URL.split(":");

export const config: Config = {
    environment,
    language: Languages.portuguese_br,
    appName: "Hunood Backend",
    baseUrl: process.env.BASEURL || "http://localhost:3001/",
    baseUrlFrontend: process.env.BASEURL_FRONTEND || "http://localhost:3000/",
    port: Number(process.env.PORT) || 3001,
    database: dbconfig,
    redis: {
        password: REDIS_URL[2].split("@")[0],
        host: REDIS_URL[2].split("@")[1],
        port: Number(REDIS_URL[3].split("/")[0]),
    },
    auth: {
        expiresIn: Number(process.env.JWT_EXPIRES_IN),
        salt: Number(process.env.JWT_SALT),
        password: process.env.JWT_PASSWORD
    },
    email: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        service: process.env.EMAIL_SERVICE || "",
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false
    }
};
import { Options } from 'sequelize';

if (process.env.ENVIRONMENT !== 'prod') {
    require('dotenv').config();
}

const db: Options = {
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    define: {
        timestamps: true,
        underscored: true
    }
};

if(process.env.ENVIRONMENT === 'prod'){
    db.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
}

export = db;
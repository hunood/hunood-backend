import { Options } from 'sequelize';

if (process.env.ENVIRONMENT !== 'production') {
    require('dotenv').config();
}

const DATABASE_URL = process.env.DATABASE_URL.split(':');

const db: Options = {
    username: DATABASE_URL[1].split('//')[1],
    password: DATABASE_URL[2].split('@')[0],
    host: DATABASE_URL[2].split('@')[1],
    database: DATABASE_URL[3].split('/')[1],
    port: Number(DATABASE_URL[3].split('/')[0]),
    dialect: 'postgres',
    define: {
        timestamps: true,
        underscored: true
    }
};

if(process.env.ENVIRONMENT === 'production'){
    db.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
}

export = db;
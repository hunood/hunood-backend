if (process.env.ENVIRONMENT !== 'prod') {
    require('dotenv').config();
}

const db = {
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    define: {
        timestamps: true,
        underscored: true
    }
};

export = db;
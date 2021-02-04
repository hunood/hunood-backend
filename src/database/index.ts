// const Sequelize = require('sequelize');
// const chalk = require('chalk');
import { Sequelize } from 'sequelize';
import chalk from 'chalk';
import db from '../database';
import { Users } from '../models/User';

class Connection {
    _connection;

    constructor() {
        // constructor(database: string, username: string, password?: string, options?: Options);
        // constructor(database: string, username: string, options?: Options);
        this._connection = new Sequelize(db as any);
        this._connection.authenticate()
            .then(() => {
                console.log(chalk.green('DATABASE CONNECTED'), `to port: ${db.port}`);

                Users.init(this.connection);

            })
            .catch((error) => {
                console.log(chalk.red('DATABASE ERROR'));
                console.log(JSON.stringify(db));
                throw `Unable to connect to the database: ${error}`;
            });
    }

    get connection() {
        return this._connection;
    }
}

export { Connection };

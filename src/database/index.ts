import { Sequelize } from 'sequelize';
import chalk from 'chalk';
import db from '../config.database';
class Connection {
    private static conn: Sequelize;

    private init() {
        if (Connection.conn) {
            return;
        }
        Connection.conn = new Sequelize(db);
        this.authenticate();
    }

    private authenticate() {
        Connection.conn.authenticate()
            .then(() => {
                console.log(chalk.green('DATABASE CONNECTED'), `to port: ${db.port}`);
            })
            .catch((error) => {
                console.log(chalk.red('DATABASE ERROR'));
                console.log(JSON.stringify(db));
                throw `Unable to connect to the database: ${error}`;
            });
    }

    get connection() {
        if (!Connection.conn) {
            this.init();
        }
        return Connection.conn;
    }
}

export const connection = new Connection().connection;

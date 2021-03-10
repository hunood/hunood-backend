import { Sequelize } from 'sequelize';
import db from '../config.database';
class Connection {
    private static instance: Sequelize = null;

    public static getInstance() {
        if (!this.instance) {
            this.instance = new Sequelize(db);
        }
        return this.instance;
    }

    public static async isConnected() {
        try {
            await this.instance?.authenticate();
            return this.instance;
        } catch (_) {
            return null;
        }
    }
}

export const connection = Connection.getInstance();
export const isConnected = Connection.isConnected();

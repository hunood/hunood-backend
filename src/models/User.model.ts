import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class User extends Model {
    public id!: string;
    public name!: string;
    public email!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        name: Sequelize.STRING,
        email: Sequelize.STRING
    },
    {
        sequelize: connection,
        modelName: 'User'
    }
);


export { User };
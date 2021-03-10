import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class TipoConta extends Model {
    public id!: string;
    public nome!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

TipoConta.init(
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        nome: Sequelize.STRING
    },
    {
        sequelize: connection,
        modelName: 'TipoConta',
        tableName: 'tipos-conta'
    }
);

export { TipoConta };
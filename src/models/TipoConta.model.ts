import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class TipoConta extends Model {
    public id!: string;
    public nome!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models) {
        // this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user'});
    }
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
        modelName: 'TipoConta'
    }
);

TipoConta.associate(connection.models);

export { TipoConta };
import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class TipoProduto extends Model {
    public id!: string;
    public nome!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models) {
        // this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user'});
    }
}

TipoProduto.init(
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        nome: Sequelize.STRING
    },
    {
        sequelize: connection,
        modelName: 'TipoProduto'
    }
);

TipoProduto.associate(connection.models);

export { TipoProduto };
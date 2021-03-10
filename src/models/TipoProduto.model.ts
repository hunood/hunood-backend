import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class TipoProduto extends Model {
    public id!: string;
    public nome!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
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
        modelName: 'TipoProduto',
        tableName: 'tipos-produto'
    }
);

export { TipoProduto };
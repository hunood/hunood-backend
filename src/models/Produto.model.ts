import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class Produto extends Model {
    public id!: string;
    public id_lote!: string;
    public id_fornecedor!: string;
    public id_tipos_produto!: string;
    public nome!: string;
    public unidade_medida!: string;
    public quantidade!: number;
    public preco_unidade!: number;
    public marca!: string;
    public perecivel!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models) {
        // this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user'});
    }
}

Produto.init(
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        id_lote: Sequelize.UUID,
        id_fornecedor: Sequelize.UUID,
        id_tipos_produto: Sequelize.UUID,
        nome: Sequelize.STRING,
        unidade_medida: Sequelize.STRING,
        quantidade: Sequelize.DOUBLE,
        preco_unidade: Sequelize.DOUBLE,
        marca: Sequelize.STRING,
        perecivel: Sequelize.BOOLEAN,
    },
    {
        sequelize: connection,
        modelName: 'Produto',
        tableName: 'produtos'
    }
);

Produto.associate(connection.models);

export { Produto };
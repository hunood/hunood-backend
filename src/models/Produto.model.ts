import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class Produto extends Model {
    public id!: string;
    public id_empresa!: string;
    public id_tipo_produto!: number;
    public nome!: string;
    public unidade_medida!: string;
    public quantidade!: number;
    public preco_unidade!: number;
    public marca!: string;
    public codigo!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Produto.init(
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        id_empresa: Sequelize.STRING,
        id_tipo_produto: Sequelize.NUMBER,
        nome: Sequelize.STRING,
        unidade_medida: Sequelize.STRING,
        quantidade: Sequelize.DOUBLE,
        preco_unidade: Sequelize.DOUBLE,
        marca: Sequelize.STRING,
        codigo: Sequelize.STRING
    },
    {
        sequelize: connection,
        modelName: 'Produto',
        tableName: 'produtos'
    }
);

export { Produto };
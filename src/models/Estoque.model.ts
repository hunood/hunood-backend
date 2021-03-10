import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class Estoque extends Model {
    public id!: string;
    public id_empresa!: string;
    public id_autenticacao!: string;
    public id_produto!: string;
    public data_entrada!: Date;
    public data_saida!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Estoque.init(
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        id_empresa: Sequelize.UUID,
        id_autenticacao: Sequelize.UUID,
        id_produto: Sequelize.UUID,
        data_entrada: Sequelize.DATE,
        data_saida: Sequelize.DATE
    },
    {
        sequelize: connection,
        modelName: 'Estoque',
        tableName: 'estoques'
    }
);

export { Estoque };
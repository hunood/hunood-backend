import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class Lote extends Model {
    public id!: string;
    public id_produto!: string;
    public data_fabricacao!: Date;
    public data_validade!: Date;
    public observacoes!: string;
    public codigo!: string;
    public quantidade_produtos!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Lote.init(
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        id_produto: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        data_fabricacao: Sequelize.DATE,
        data_validade: Sequelize.DATE,
        observacoes: Sequelize.STRING,
        codigo: Sequelize.STRING,
        quantidade_produtos: Sequelize.DOUBLE
    },
    {
        sequelize: connection,
        modelName: 'Lote',
        tableName: 'lotes'
    }
);

export { Lote };
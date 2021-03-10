import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class Caixa extends Model {
    public id!: string;
    public id_empresa!: string;
    public id_tipos_contas!: string;
    public valor!: number;
    public data_referencia!: Date;
    public eh_entrada!: boolean;
    public observacoes!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Caixa.init(
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        id_empresa: Sequelize.UUID,
        id_tipos_contas: Sequelize.UUID,
        valor: Sequelize.DOUBLE,
        data_referencia: Sequelize.DATE,
        eh_entrada: Sequelize.BOOLEAN,
        observacoes: Sequelize.STRING
    },
    {
        sequelize: connection,
        modelName: 'Caixa',
        tableName: 'caixas'
    }
);

export { Caixa };
import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class TipoContato extends Model {
    public id!: string;
    public nome!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

TipoContato.init(
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        nome: Sequelize.STRING
    },
    {
        sequelize: connection,
        modelName: 'TipoContato',
        tableName: 'tipos-contato'
    }
);

export { TipoContato };
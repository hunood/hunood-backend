import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class Associado extends Model {
    public id_autenticacao!: string;
    public id_empresa!: string;
    public usuario_primario!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Associado.init(
    {
        id_autenticacao: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        id_empresa: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        usuario_primario: Sequelize.BOOLEAN
    },
    {
        sequelize: connection,
        modelName: 'Associado',
        tableName: 'associados'
    }
);

export { Associado };
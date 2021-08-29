import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class Associado extends Model {
    public id_autenticacao!: string;
    public id_empresa!: string;
    public tipo_usuario!: boolean;
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
        tipo_usuario: Sequelize.ENUM(...["ADMINISTRADOR", "COLABORADOR"])
    },
    {
        sequelize: connection,
        modelName: 'Associado',
        tableName: 'associados'
    }
);

export { Associado };
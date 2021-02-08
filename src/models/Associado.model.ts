import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class Associado extends Model {
    public id!: string;
    public id_autenticacao!: string;
    public id_empresa!: string;
    public usuario_primario!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models){
        // this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user'});
    }
}

Associado.init(
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        id_autenticacao: Sequelize.UUID,
        id_empresa: Sequelize.UUID,
        usuario_primario: Sequelize.BOOLEAN
    },
    {
        sequelize: connection,
        modelName: 'Associado'
    }
);

Associado.associate(connection.models);

export { Associado };
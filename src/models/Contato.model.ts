import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class Contato extends Model {
    public id!: string;
    public id_tipo_contato!: string;
    public id_empresa!: string;
    public id_fornecedor!: string;
    public id_usuario!: string;
    public nome!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models) {
        // this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user'});
    }
}

Contato.init(
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        id_tipo_contato: Sequelize.UUID,
        id_empresa: Sequelize.UUID,
        id_fornecedor: Sequelize.UUID,
        id_usuario: Sequelize.UUID,
        nome: Sequelize.STRING
    },
    {
        sequelize: connection,
        modelName: 'Contato'
    }
);

Contato.associate(connection.models);

export { Contato };
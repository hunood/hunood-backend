import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class Lote extends Model {
    public id!: string;
    public data_fabricacao!: Date;
    public data_validade!: Date;
    public observacoes!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models){
        // this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user'});
    }
}

Lote.init(
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        data_fabricacao: Sequelize.DATE,
        data_validade: Sequelize.DATE,
        nome_fantasia: Sequelize.STRING,
        observacoes: Sequelize.STRING
    },
    {
        sequelize: connection,
        modelName: 'Lote'
    }
);

Lote.associate(connection.models);

export { Lote };
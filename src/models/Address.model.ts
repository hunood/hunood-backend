import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class Address extends Model {
    public id!: string;
    public zipcode!: string;
    public street!: string;
    public number!: number;
    public user_id!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user'});
    }
}

Address.init(
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        zipcode: Sequelize.STRING,
        street: Sequelize.STRING,
        number: Sequelize.NUMBER,
        user_id: Sequelize.UUID,
    },
    {
        sequelize: connection,
        modelName: 'Address'
    }
);

Address.associate(connection.models);

export { Address };
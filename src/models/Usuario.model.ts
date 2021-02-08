import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class Usuario extends Model {
    public id!: string;
    public id_autenticacao!: string;
    public cpf!: string;
    public nome!: string;
    public data_nascimento!: Date;
    public genero!: 'MASCULINO' | 'FEMININO' | 'OMITIDO' | 'OUTRO';
    public genero_personalizado: string;
    public tratar_por: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models) {
        // this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user'});
    }
}

Usuario.init(
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        id_autenticacao: Sequelize.UUID,
        cpf: Sequelize.STRING,
        nome: Sequelize.STRING,
        data_nascimento: Sequelize.DATE,
        genero: {
            type: Sequelize.ENUM,
            values: ['MASCULINO', 'FEMININO', 'OMITIDO', 'OUTRO']
        },
        genero_personalizado: Sequelize.STRING,
        tratar_por: Sequelize.STRING
    },
    {
        sequelize: connection,
        modelName: 'Usuario'
    }
);

Usuario.associate(connection.models);

export { Usuario };
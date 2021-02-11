import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class Autenticacao extends Model {
    public id!: string;
    public email!: string;
    public senha!: string;
    public email_valido!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models){
        this.belongsTo(models.Associado, { foreignKey: 'id', as: 'autentica' });     
    }
}

Autenticacao.init(
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        email: Sequelize.STRING,
        senha: Sequelize.STRING,
        email_valido: Sequelize.BOOLEAN
    },
    {
        sequelize: connection,
        modelName: 'Autenticacao',
        tableName: 'autenticacoes'
    }
);

// new Autenticacao();

export { Autenticacao };
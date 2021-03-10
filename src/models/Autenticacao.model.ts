import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class Autenticacao extends Model {
    public id!: string;
    public email!: string;
    public senha!: string;
    public email_valido!: boolean;
    public etapa_onboarding!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Autenticacao.init(
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        email: Sequelize.STRING,
        senha: Sequelize.STRING,
        email_valido: Sequelize.BOOLEAN,
        etapa_onboarding: Sequelize.INTEGER,
    },
    {
        sequelize: connection,
        modelName: 'Autenticacao',
        tableName: 'autenticacoes'
    }
);

export { Autenticacao };
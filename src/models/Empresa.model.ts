import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';

class Empresa extends Model {
    public id!: string;
    public cnpj: string;
    public razao_social: string;
    public nome_fantasia!: boolean;
    public cep_logradouro!: string;
    public nome_logradouro!: string;
    public numero_logradouro!: number;
    public complemento_logradouro!: string;
    public bairro_logradouro!: string;
    public cidade_logradouro!: string;
    public estado_logradouro!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models) {
        // this.belongsTo(models.Associado, { foreignKey: 'id_empresa', as: 'associado' });
    }
}

Empresa.init(
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        cnpj: Sequelize.STRING,
        razao_social: Sequelize.STRING,
        nome_fantasia: Sequelize.STRING,
        cep_logradouro: Sequelize.STRING,
        nome_logradouro: Sequelize.STRING,
        numero_logradouro: Sequelize.NUMBER,
        complemento_logradouro: Sequelize.STRING,
        bairro_logradouro: Sequelize.STRING,
        cidade_logradouro: Sequelize.STRING,
        estado_logradouro: Sequelize.STRING
    },
    {
        sequelize: connection,
        modelName: 'Empresa',
        tableName: 'empresas'
    }
);

Empresa.associate(connection.models);

export { Empresa };
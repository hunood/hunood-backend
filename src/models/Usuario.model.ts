import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';
import { Enums } from '../typing';

class Usuario extends Model {
    public id!: string;
    public cpf!: string;
    public nome!: string;
    public data_nascimento!: Date;
    public genero!: keyof typeof Enums.Generos;
    public genero_personalizado: string;
    public tratar_por: keyof typeof Enums.TratarComo;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Usuario.init(
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        cpf: Sequelize.STRING,
        nome: Sequelize.STRING,
        data_nascimento: Sequelize.DATE,
        genero: {
            type: Sequelize.ENUM,
            values: Object.keys(Enums.Generos)
        },
        genero_personalizado: Sequelize.STRING,
        tratar_por: {
            type: Sequelize.ENUM,
            values: Object.keys(Enums.Generos)
        }
    },
    {
        sequelize: connection,
        modelName: 'Usuario',
        tableName: 'usuarios'
    }
);

export { Usuario };
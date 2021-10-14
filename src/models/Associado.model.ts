import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';
import { TipoUsuario } from '../typing/enums';

class Associado extends Model {
    public id_autenticacao!: string;
    public id_empresa!: string;
    public nome_usuario!: string;
    public usuario_ativo!: boolean;
    public tipo_usuario!: TipoUsuario;
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
        nome_usuario: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        usuario_ativo: {
            type: Sequelize.BOOLEAN,
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
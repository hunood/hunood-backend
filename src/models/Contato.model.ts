import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';
import { TiposTelefone } from '../typing/enums';

class Contato extends Model {
    public id!: string;
    public contato!: string;
    public tipo_contato!: keyof TiposTelefone;
    public id_empresa!: string;
    public id_fornecedor!: string;
    public id_usuario!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Contato.init(
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        contato: Sequelize.STRING,
        tipo_contato: Sequelize.ENUM(...['FIXO', 'CELULAR', 'WHATSAPP', 'CELULAR_WHATS']),
        id_empresa: Sequelize.UUID,
        id_fornecedor: Sequelize.UUID,
        id_usuario: Sequelize.UUID
    },
    {
        sequelize: connection,
        modelName: 'Contato',
        tableName: 'contatos'
    }
);

export { Contato };
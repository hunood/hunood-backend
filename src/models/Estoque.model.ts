import Sequelize, { Model } from 'sequelize';
import { connection } from '../database';
import { Enums } from '../typing';

class Estoque extends Model {
    public id!: string;
    public id_empresa!: string;
    public id_autenticacao!: string;
    public id_produto!: string;
    public id_lote!: string;
    public tipo_acao!: keyof typeof Enums.TipoAcaoEstoque;
    public data_acao!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Estoque.init(
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        id_empresa: Sequelize.UUID,
        id_autenticacao: Sequelize.UUID,
        id_produto: Sequelize.UUID,
        id_lote: Sequelize.UUID,
        tipo_acao: {
            type: Sequelize.ENUM,
            values: Object.keys(Enums.TipoAcaoEstoque)
        },
        data_acao: Sequelize.DATE
    },
    {
        sequelize: connection,
        modelName: 'Estoque',
        tableName: 'estoques'
    }
);

export { Estoque };
import { Sequelize } from 'sequelize';
import db from '../config.database';
import {
    Autenticacao,
    Usuario,
    Empresa,
    Associado,
    Fornecedor,
    Lote,
    TipoProduto,
    Produto,
    Estoque,
    TipoConta,
    Caixa,
    TipoContato,
    Contato,
} from '../models';
class Connection {
    private static instance: Sequelize = null;

    public static getInstance() {
        if (!this.instance) {
            this.instance = new Sequelize(db);
            this.initAssociations();
        }
        return this.instance;
    }

    public static async isConnected() {
        try {
            await this.instance?.authenticate();
            return this.instance;
        } catch (_) {
            return null;
        }
    }

    private static initAssociations() {
        this.instance?.authenticate().then(() => {
            Autenticacao.associate(this.instance.models);
            Usuario.associate(this.instance.models);
            Empresa.associate(this.instance.models);
            Associado.associate(this.instance.models);
            Fornecedor.associate(this.instance.models);
            Lote.associate(this.instance.models);
            TipoProduto.associate(this.instance.models);
            Produto.associate(this.instance.models);
            Estoque.associate(this.instance.models);
            TipoConta.associate(this.instance.models);
            Caixa.associate(this.instance.models);
            TipoContato.associate(this.instance.models);
            Contato.associate(this.instance.models);
        });
    }
}

export const connection = Connection.getInstance();
export const isConnected = Connection.isConnected();

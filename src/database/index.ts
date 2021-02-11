import { Sequelize } from 'sequelize';
import chalk from 'chalk';
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
import { t } from '../i18n';
class Connection {
    private static conn: Sequelize;

    private init() {
        if (Connection.conn) {
            return;
        }
        Connection.conn = new Sequelize(db);
        this.authenticate();
    }

    private authenticate() {
        Connection.conn.authenticate()
            .then(() => {
                Autenticacao.associate(connection.models);
                Usuario.associate(connection.models);
                Empresa.associate(connection.models);
                Associado.associate(connection.models);
                Fornecedor.associate(connection.models);
                Lote.associate(connection.models);
                TipoProduto.associate(connection.models);
                Produto.associate(connection.models);
                Estoque.associate(connection.models);
                TipoConta.associate(connection.models);
                Caixa.associate(connection.models);
                TipoContato.associate(connection.models);
                Contato.associate(connection.models);
                console.log(chalk.green(t('messages:banco-inicializado')), t('messages:na-porta', { porta: db.port }));
            })
            .catch((error) => {
                console.log(JSON.stringify(db));
                throw t('messages:banco-nao-inicializado', { erro: error });
            });
    }

    get connection() {
        if (!Connection.conn) {
            this.init();
        }
        return Connection.conn;
    }
}

export const connection = new Connection().connection;

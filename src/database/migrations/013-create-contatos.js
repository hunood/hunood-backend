'use strict';

module.exports = {
//   id_contato VARCHAR(45) PRIMARY KEY,
// nome VARCHAR(60),
// id_tipo_contato VARCHAR(40),
// id_empresa VARCHAR(40),
// id_fornecedor VARCHAR(40),
// FOREIGN KEY(id_empresa) REFERENCES empresas (id_empresa),
// FOREIGN KEY(id_fornecedor) REFERENCES fornecedores (id_fornecedor)
// )

  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('tipos-contas', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      id_tipo_contato: {
        type: Sequelize.UUID,
        primaryKey: false,
        allowNull: false,
        references: { model: 'tipos-contatos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      id_empresas: {
        type: Sequelize.UUID,
        primaryKey: false,
        allowNull: false,
        references: { model: 'empresas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      id_fornecedor: {
        type: Sequelize.UUID,
        primaryKey: false,
        allowNull: false,
        references: { model: 'forncedores', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      nome: { 
        type: Sequelize.STRING,
        allowNull: false 
      },
      created_at: { 
        type: Sequelize.DATE,
        allowNull: false 
      },
      updated_at: { 
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tipos-contas')
  }
};

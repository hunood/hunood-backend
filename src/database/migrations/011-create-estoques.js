'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('estoques', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      id_empresa: {
        type: Sequelize.UUID,
        primaryKey: false,
        allowNull: false,
        references: { model: 'empresas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      id_autenticacao: {
        type: Sequelize.UUID,
        primaryKey: false,
        allowNull: false,
        references: { model: 'autenticacoes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      id_produto: {
        type: Sequelize.UUID,
        primaryKey: false,
        allowNull: false,
        references: { model: 'produtos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      id_lote: {
        type: Sequelize.UUID,
        primaryKey: false,
        allowNull: false,
        references: { model: 'lotes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      tipo_acao: {
        type: Sequelize.ENUM(['ENTRADA', 'SAIDA']),
        allowNull: false
      },
      data_acao: { 
        type: Sequelize.DATE,
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
    return queryInterface.dropTable('estoques')
  }
};

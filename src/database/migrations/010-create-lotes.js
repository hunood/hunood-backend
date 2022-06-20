'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('lotes', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      id_produto: {
        type: Sequelize.UUID,
        primaryKey: false,
        allowNull: false,
        references: { model: 'produtos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      data_fabricacao: {
        type: Sequelize.DATE,
        allowNull: true
      },
      data_validade: {
        type: Sequelize.DATE,
        allowNull: true
      },
      observacoes: {
        type: Sequelize.STRING,
        allowNull: true
      },
      codigo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      quantidade_produtos: {
        type: Sequelize.DOUBLE,
        allowNull: true
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
    return queryInterface.dropTable('lotes')
  }
};

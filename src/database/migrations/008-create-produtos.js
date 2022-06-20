'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('produtos', {
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
      id_tipo_produto: {
        type: Sequelize.INTEGER,
        primaryKey: false,
        allowNull: false,
        references: { model: 'tipos-produto', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      unidade_medida: {
        type: Sequelize.STRING,
        allowNull: false
      },
      quantidade: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      preco_unidade: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      marca: {
        type: Sequelize.STRING,
        allowNull: true
      },
      codigo: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('produtos')
  }
};

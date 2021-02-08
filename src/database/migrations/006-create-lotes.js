'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('lotes', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      data_fabricacao: { 
        type: Sequelize.DATE,
        allowNull: false 
      },
      data_validade: { 
        type: Sequelize.DATE,
        allowNull: false 
      },
      observacoes: { 
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
    return queryInterface.dropTable('lotes')
  }
};

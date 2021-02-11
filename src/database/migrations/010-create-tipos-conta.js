'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('tipos-conta', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
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
    return queryInterface.dropTable('tipos-conta')
  }
};

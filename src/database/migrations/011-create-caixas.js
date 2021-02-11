'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('caixas', {
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
      id_tipos_contas: {
        type: Sequelize.UUID,
        primaryKey: false,
        allowNull: false,
        references: { model: 'tipos-conta', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      valor: { 
        type: Sequelize.DOUBLE,
        allowNull: false 
      },
      data_referencia: { 
        type: Sequelize.DATE,
        allowNull: true 
      },
      eh_entrada: { 
        type: Sequelize.BOOLEAN,
        allowNull: true 
      },
      observacoes: { 
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
    return queryInterface.dropTable('caixas')
  }
};

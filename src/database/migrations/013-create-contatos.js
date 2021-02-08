'use strict';

module.exports = {
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
        references: { model: 'tipos-contato', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      id_empresa: {
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
        references: { model: 'fornecedores', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      id_usuario: {
        type: Sequelize.UUID,
        primaryKey: false,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
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

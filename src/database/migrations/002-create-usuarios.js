'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      id_autenticacao: {
        type: Sequelize.UUID,
        primaryKey: false,
        allowNull: false,
        references: { model: 'autenticacoes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      data_nascimento: {
        type: Sequelize.DATE,
        allowNull: false
      },
      genero: {
        type: Sequelize.ENUM('MASCULINO', 'FEMININO', 'OMITIDO',  'OUTRO'),
        allowNull: false
      },
      genero_personalizado: {
        type: Sequelize.DATE,
        allowNull: true
      },
      tratar_por: {
        type: Sequelize.DATE,
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
    return queryInterface.dropTable('usuarios')
  }
};

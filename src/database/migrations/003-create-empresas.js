'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('empresas', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      cnpj: {
        type: Sequelize.STRING,
        allowNull: true
      },
      razao_social: {
        type: Sequelize.STRING,
        allowNull: true
      },
      nome_fantasia: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cep_logradouro: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nome_logradouro: {
        type: Sequelize.STRING,
        allowNull: false
      },
      numero_logradouro: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      complemento_logradouro: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bairro_logradouro: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cidade_logradouro: {
        type: Sequelize.STRING,
        allowNull: false
      },
      estado_logradouro: {
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
    return queryInterface.dropTable('empresas')
  }
};

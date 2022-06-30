'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('contatos', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      id_empresa: {
        type: Sequelize.UUID,
        primaryKey: false,
        allowNull: true,
        references: { model: 'empresas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      id_fornecedor: {
        type: Sequelize.UUID,
        primaryKey: false,
        allowNull: true
      },
      id_usuario: {
        type: Sequelize.UUID,
        primaryKey: false,
        allowNull: true,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      tipo_contato: {
        type: Sequelize.ENUM(['FIXO', 'CELULAR', 'WHATSAPP', 'CELULAR_WHATS']),
        allowNull: false
      },
      contato: {
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
    return queryInterface.dropTable('contatos')
  }
};

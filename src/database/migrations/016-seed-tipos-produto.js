'use strict';

module.exports = {
    up: async (queryInterface) => queryInterface.bulkInsert('tipos-produto', [
        {
            id: 1,
            nome: 'Perecível',
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            id: 2,
            nome: 'Imperecível',
            created_at: new Date(),
            updated_at: new Date()
        },
    ], {}),
    down: async (queryInterface) => {
        await queryInterface.bulkDelete('Currencies', { [Op.or]: [{ name: 'USD' }, { name: 'EUR' }] });
    }
};
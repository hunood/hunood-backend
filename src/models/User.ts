const { Model, DataTypes } = require('sequelize');

class Users extends Model {
    static init(sequelize) {
        super.init({
            name: {
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING
            }
        }, {
            sequelize,
            modelName: 'User'
        })
    }
}

export { Users as Users };
// module.exports = Users;
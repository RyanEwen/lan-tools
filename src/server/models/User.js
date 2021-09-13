import Sequelize from 'sequelize'
import getSequelize from '../sequelize'

class User extends Sequelize.Model {}

User.init({
    email: {
        type: Sequelize.STRING(64),
        unique: 'user',
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Email address is required',
            },
            isEmail: {
                args: true,
                msg: 'Invalid email address',
            },
        },
    },
    name: {
        type: Sequelize.STRING(64),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Name is required',
            },
        },
    },
    nicknames: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
        get: function () {
            return JSON.parse(this.getDataValue('nicknames') || '[]')
        },
        set: function (value) {
            this.setDataValue('nicknames', JSON.stringify(value))
        },
    },
    ipAddress: {
        type: Sequelize.STRING(64),
        allowNull: true,
    },
}, {
    sequelize: getSequelize(),
    modelName: 'User',
    paranoid: true,
})

export default User

import Sequelize from 'sequelize'
import sequelize from '../sequelize'

class User extends Sequelize.Model {}

User.init({
    discordId: {
        type: Sequelize.STRING(64),
        unique: 'user',
        allowNull: false,
    },
    discordAvatar: {
        type: Sequelize.STRING(255),
    },
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
    hostname: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'User',
    paranoid: true,
})

export default User

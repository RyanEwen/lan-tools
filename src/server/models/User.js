import Sequelize from 'sequelize'
import getSequelize from '../sequelize'

class User extends Sequelize.Model {}

User.init({
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
        type: Sequelize.STRING(64),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Nicknames are required',
            },
        },
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
}, {
    sequelize: getSequelize(),
    modelName: 'User',
    paranoid: true,
})

export default User

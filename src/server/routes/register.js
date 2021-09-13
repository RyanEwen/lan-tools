import SharedUtilities from '../../shared/classes/SharedUtilities'
import Utilities from '../classes/Utilities'
import User from '../models/User'
import logout from '../routes/logout'

class RegisterRoute {
    static async register(socket, session, message) {
        if (Utilities.isLoggedIn(socket, session)) {
            throw new Error('Already registered and signed in')
        }

        // clear old session data in case login was started and not finished
        logout(socket, session)

        SharedUtilities.requireValues({
            'Email address': message.email,
            'Name': message.name,
            'Nicknames': message.nicknames,
        })

        // check if a user already exists

        const existingUser = await User.findOne({
            where: {
                email: message.email,
            },
        })

        if (existingUser) {
            throw new Error('A user with this email address already exists')
        }

        // create user

        const [user, userIsNew] = await User.findOrCreate({
            where: {
                email: message.email,
            },
            defaults: {
                name: message.name,
                nicknames: message.nicknames,
            },
        })

        if (!userIsNew) {
            await user.update({
                name: message.name,
                nicknames: message.nicknames,
            })
        }

        console.log('User registered', user)

        return 'Registration successful'
    }
}

export default async function (socket, session, message) {
    return RegisterRoute[message.step](socket, session, message)
}

import SharedUtilities from '../../shared/classes/SharedUtilities'
import Utilities from '../classes/Utilities'
import User from '../models/User'
import emitSession from './emitSession'

export default async function (socket, session, message) {
    await Utilities.requireLogin(socket, session, false)

    SharedUtilities.requireValues({
        'Name': message.name,
        'Nicknames': message.nicknames,
    })

    const user = await User.findByPk(socket.userId)

    // update profile

    await user.update({
        name: message.name,
        nicknames: message.nicknames,
    })

    await emitSession(socket, session)

    console.log('User updated account details', session)

    return 'Account details updated'
}

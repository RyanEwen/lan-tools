import SharedUtilities from '../../shared/classes/SharedUtilities'
import Utilities from '../classes/Utilities'
import User from '../models/User'
import getState from './state'

export default async function (socket, session, message) {
    await Utilities.requireLogin(socket, session, false)

    SharedUtilities.requireValues({
        'Name': message.name,
        'Nicknames': message.nicknames,
    })

    // update profile
    const user = await User.findByPk(socket.userId)
    user.name = message.name
    user.nicknames = message.nicknames

    const userChanged = user.changed()

    await user.save()

    if (userChanged) {
        socket.server.to(session.id).emit('session', { user })
        socket.server.to('general').emit('state', await getState())
    }

    console.log('User updated account details', session)

    return 'Account details updated'
}

import SharedUtilities from '../../shared/classes/SharedUtilities'
import Utilities from '../classes/Utilities'
import User from '../models/User'
import getState from '../state'

export default async function (socket, session, message) {
    await Utilities.requireLogin(socket, session, false)

    SharedUtilities.requireValues({
        'Name': message.name,
        'Nicknames': message.nicknames,
    })

    // get and update user
    const user = await User.findByPk(session.passport.user)
    user.name = message.name
    user.nicknames = message.nicknames

    const userChanged = user.changed()

    await user.save()

    if (userChanged) {
        // get latest state
        const state = await getState()

        socket.server.to(`user-${user.id}`).emit('user', user)
        socket.server.to('general').emit('state', state)
    }

    console.log('User updated account details', session)

    return 'Account details updated'
}

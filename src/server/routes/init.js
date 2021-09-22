import Utilities from '../classes/Utilities'
import User from '../models/User'
import getState from '../state'

export default async function (socket, session, message = {}) {
    // do stuff that normally happens during login, in case this socket was created while already-logged-in
    if (Utilities.isLoggedIn(socket, session)) {
        const hostnames = await Utilities.getHostname(socket.request.connection.remoteAddress)

        // get and update user
        const user = await User.findByPk(session.passport.user)
        user.ipAddress = socket.request.connection.remoteAddress
        user.hostname = hostnames[0] || 'n/a'

        const userChanged = user.changed()

        await user.save()

        // get latest state
        const state = await getState()

        if (userChanged) {
            socket.server.to('general').emit('state', state)
        }

        // join the user-wide channel and general channel
        socket.join(`user-${session.passport.user}`)
        socket.join('general')

        return { user, state }

    } else {
        return { user: null, state: null }
    }
}

import Utilities from '../classes/Utilities'
import User from '../models/User'
import getState from './state'

export default async function (socket, session, message = {}) {
    // do stuff that normally happens during login,
    // in case this socket is created while already-logged-in

    // associate socker to user
    socket.userId = session.userId

    // join session-wide channel specific to this clinic
    socket.join(session.id)

    if (Utilities.isLoggedIn(socket, session)) {
        const hostnames = await Utilities.getHostname(socket.request.connection.remoteAddress)

        const user = await User.findByPk(socket.userId)
        user.ipAddress = socket.request.connection.remoteAddress
        user.hostname = hostnames[0] || 'n/a'

        const userChanged = user.changed()

        await user.save()

        if (userChanged) {
            socket.server.to('general').emit('state', await getState())
        }

        // join the user-wide channel and general channels
        socket.join(`user-${socket.userId}`)
        socket.join('general')

        const state = await getState()

        return { user, state }
    } else {
        return { user: null, state: null }
    }
}

import SharedUtilities from '../../shared/classes/SharedUtilities'
import Utilities from '../classes/Utilities'
import User from '../models/User'
import getState from './state'

export default async function (socket, session, message) {
    if (Utilities.isLoggedIn(socket, session)) {
        throw new Error('Already logged in')
    }

    SharedUtilities.requireValues({
        'Email address': message.email,
    })

    // lookup user

    const user = await User.findOne({
        where: {
            email: message.email,
        },
    })

    if (!user) {
        throw new Error('User not found')
    }

    const hostnames = await Utilities.getHostname(socket.request.connection.remoteAddress)

    user.ipAddress = socket.request.connection.remoteAddress
    user.hostname = hostnames[0] || 'n/a'

    const userChanged = user.changed()

    await user.save()

    // update all users
    if (userChanged) {
        socket.server.to('general').emit('state', await getState())
    }

    // update session

    session.userId = user.id
    session.save()

    // find all the sockets associated with this session
    const allSockets = Object.values(socket.server.clients().sockets)
    const sessionSockets = allSockets.filter((sock) => session.id in sock.rooms)

    sessionSockets.forEach((sock) => {
        // associate socket to user
        sock.userId = session.userId

        // join the user-wide channel and general channels
        sock.join(`user-${socket.userId}`)
        sock.join('general')
    })

    // tell all sockets in this session what the current state is
    socket.server.to(session.id).emit('state', await getState())

    // tell all sockets in this session that the user is logged in
    socket.server.to(session.id).emit('session', { user })

    console.log('User logged in', session)

    return {
        msg: 'Login successful',
    }
}

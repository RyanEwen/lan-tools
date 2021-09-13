import SharedUtilities from '../../shared/classes/SharedUtilities'
import Utilities from '../classes/Utilities'
import User from '../models/User'
import emitSession from './emitSession'

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

    // update session

    session.userId = user.id
    session.save()

    // associate socket to user

    socket.userId = user.id

    const allSockets = Object.values(socket.server.clients().sockets)
    const sessionSockets = allSockets.filter((sock) => session.id in sock.rooms)

    // have each socket in this session join the user-wide channel
    sessionSockets.forEach((sock) => {
        sock.userId = socket.userId
        sock.join(`user-${socket.userId}`)
    })

    // tell all sockets in this session at this clinic that the user is logged in
    await emitSession(socket, session)

    console.log('User logged in', session)

    return {
        msg: 'Login successful',
    }
}

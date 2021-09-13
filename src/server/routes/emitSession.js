import User from '../models/User'
import Utilities from '../classes/Utilities'

export default async function (socket, session, message = {}) {
    if (Utilities.isLoggedIn(socket, session)) {
        const user = await User.findByPk(socket.userId)

        // tell all sockets in this session that the user is logged in
        socket.server.to(session.id).emit('session', { user })

    } else {
        // tell all sockets in this session that the user is not logged in
        socket.server.to(session.id).emit('session', { user: null })
    }
}

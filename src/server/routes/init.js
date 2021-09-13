import Utilities from '../classes/Utilities'
import User from '../models/User'

export default async function (socket, session, message = {}) {
    // associate this socket to the logged-in user id, if there's one in the session for this clinic
    socket.userId = session.userId

    // join session-wide channel specific to this clinic
    socket.join(session.id)

    if (Utilities.isLoggedIn(socket, session)) {
        // join the user-wide channel
        socket.join(`user-${socket.userId}`)

        const user = await User.findByPk(socket.userId)

        await user.update({
            ipAddress: socket.request.connection.remoteAddress,
        })

        return { user }
    } else {
        return { user: null }
    }
}

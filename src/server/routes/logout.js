export default async function (socket, session, message) {
    console.log('User logged out', session)

    // find all the sockets associated with this session
    const allSockets = Object.values(socket.server.clients().sockets)
    const sessionSockets = allSockets.filter((sock) => session.id in sock.rooms)

    // have each socket in this session leave user-wide channel
    sessionSockets.forEach((sock) => {
        sock.leave('general')
        sock.leave(`user-${socket.userId}`)

        delete sock.userId
    })

    // tell all sockets in this session at this clinic that the user is not logged in
    socket.server.to(session.id).emit('session', { user: null })
    socket.server.to(session.id).emit('state', null)

    delete session.userId
    session.save()
}

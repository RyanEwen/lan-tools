import emitSession from "./emitSession"

export default async function (socket, session, message) {
    console.log('User logged out', session)

    const allSockets = Object.values(socket.server.clients().sockets)
    const sessionSockets = allSockets.filter((sock) => session.id in sock.rooms)

    // have each socket in this session leave user-wide channel
    sessionSockets.forEach((sock) => {
        sock.leave(`user-${socket.userId}`)
        delete sock.userId
    })

    delete socket.userId

    // tell all sockets in this session at this clinic that the user is not logged in
    await emitSession(socket, session)

    delete session.userId
    session.save()
}

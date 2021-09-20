import sharedsession from 'express-socket.io-session'
import socketio from 'socket.io'
import sessionHandler from './session'
import routes from './routes'

var io

export default function getSocketio (server) {
    if (io) {
        return io
    }

    io = socketio(server)

    io.use(sharedsession(sessionHandler))

    io.on('connection', async function (socket) {
        let session = socket.handshake.session

        Object.keys(routes).forEach((route) => {
            socket.on(route, async function (msg, res) {
                await new Promise((res) => session.reload(res))

                session = socket.handshake.session

                session.touch()

                try {
                    res(await routes[route](socket, session, msg))
                } catch (err) {
                    if (process.env.NODE_ENV !== 'production') {
                        console.error(err)
                    }

                    if (err.name === 'SequelizeValidationError') {
                        res({
                            error: err.errors[0].message,
                            errors: err.errors.map((error) => error.message),
                        })
                    } else {
                        res({
                            error: err.message,
                        })
                    }
                }
            })
        })
    })

    console.log('SocketIO started')

    return io
}

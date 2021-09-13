import io from 'socket.io-client'

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
const uri = protocol + '//' + window.location.host
var socket

export default function () {
    if (socket) {
        return Wrapper
    }

    socket = io(uri, { pingInterval: 5000, pingTimeout: 15000 })

    socket.on('connect', () => {
        console.log('Connected to server')
    })

    socket.on('connect_error', () => {
        console.error('Connection error', arguments)
    })

    socket.on('error', () => {
        console.error('Error', arguments)
    })

    socket.on('disconnect', () => {
        console.error('Disconnected from server')
    })

    return Wrapper
}

class Wrapper {
    static async send(method, message) {
        const promise = new Promise((res, rej) => {
            socket.emit(method, message, (response) => {
                if (response && response.error) {
                    rej(response.error)
                }

                res(response)
            })
        })

        console.debug('WS ->', method, message, promise)

        return promise
    }

    static on(method, handler, log) {
        if (log === undefined && method !== 'connect' && method !== 'disconnect') {
            log = true
        }

        const wrapper = (message) => {
            if (log) {
                console.debug('WS <<', method, message)
            }

            handler(message)
        }

        // allow for new connect handlers to be fired if already-connected
        if (method == 'connect' && socket.connected) {
            handler()
        }

        socket.on(method, wrapper)

        return function unbind() {
            socket.off(method, wrapper)
        }
    }

    static once(method, handler, log) {
        if (log === undefined && method !== 'connect' && method !== 'disconnect') {
            log = true
        }

        const wrapper = (message) => {
            if (log) {
                console.debug('WS <<', method, message)
            }

            handler(message)
        }

        socket.once(method, wrapper)

        return function unbind() {
            socket.off(method, wrapper)
        }
    }

    static off(method, handler) {
        socket.off(method, handler)
    }
}

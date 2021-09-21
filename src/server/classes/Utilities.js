import dns from 'dns'

class Utilities {
    static isLoggedIn(socket, session) {
        return !!session.passport?.user
    }

    static async requireLogin(socket, session) {
        if (!this.isLoggedIn(socket, session)) {
            throw new Error('You are not logged in')
        }
    }

    static async getHostname(ip) {
        return new Promise((res, rej) => {
            dns.reverse(ip, (err, hostnames) => {
                if (err) {
                    res([])
                }

                res(hostnames)
            })
        })
    }
}

export default Utilities

class Utilities {
    static isLoggedIn(socket, session) {
        return !!socket.userId
    }

    static async requireLogin(socket, session) {
        if (!this.isLoggedIn(socket, session)) {
            throw new Error('You are not logged in')
        }
    }
}

export default Utilities

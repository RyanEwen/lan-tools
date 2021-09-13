import Utilities from '../classes/Utilities'
import User from '../models/User'

class GuestsRoute {
    static async getGuests(socket, session, message) {
        await Utilities.requireLogin(socket, session, false)

        const users = await User.findAll()

        return { guests: users }
    }
}

export default async function (socket, session, message) {
    return GuestsRoute[message.step](socket, session, message)
}

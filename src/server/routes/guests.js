import Utilities from '../classes/Utilities'
import User from '../models/User'

class GuestsRoute {

}

export default async function (socket, session, message) {
    return GuestsRoute[message.step](socket, session, message)
}

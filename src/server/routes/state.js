import User from '../models/User'
import Utilities from '../classes/Utilities'

export default async function getState() {
    const users = await User.findAll()

    return {
        guests: users,
    }
}

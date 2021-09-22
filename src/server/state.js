import getDiscordClient from './discord'
import User from './models/User'
import dotenv from 'dotenv'

dotenv.config()

var state = {}

export async function setState(newState) {
    state = { ...newState }
}

export default async function getState() {
    const users = await User.findAll()
    const discordClient = await getDiscordClient()
    const guild = await discordClient.guilds.fetch(process.env.DISCORD_SERVER_ID)
    const guests = await Promise.all(users.map(async (user) => {
        const discordMember = await guild.members.fetch(user.discordId)

        return {
            ...user.get({ plain: true }),
            discordPresence: discordMember?.presence,
        }
    }))

    // return state + guests
    return {
        ...state,
        guests,
    }
}

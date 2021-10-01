import Discord from 'discord.js'

var client
var lastUserCount = 0

export async function updatePresence(userCount) {
    const discordClient = await getDiscordClient()

    // use cache to prevent pointless updates
    if (userCount == lastUserCount) {
        return
    }

    // update cache
    lastUserCount = userCount

    // set or clear presence
    if (userCount) {
        discordClient.user.setActivity(`${userCount} users in the app!`, { type: 'WATCHING' })
    } else {
        discordClient.user.setActivity(null)
    }
}

export default async function getDiscordClient () {
    if (client) {
        return client
    }

    client = new Discord.Client({
        intents: [
            Discord.Intents.FLAGS.GUILDS,
            Discord.Intents.FLAGS.GUILD_MEMBERS,
            Discord.Intents.FLAGS.GUILD_PRESENCES,
        ],
        presence: {
            activity: null,
        },
    })

    await client.login(process.env.DISCORD_TOKEN)

    console.log('Discord bot is ready')

    return client
}

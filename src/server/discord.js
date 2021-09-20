import Discord from 'discord.js'

var client

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
    })

    await client.login(process.env.DISCORD_TOKEN)

    console.log('Discord bot is ready')

    return client
}

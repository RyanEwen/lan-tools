console.log(`Starting in ${process.env.NODE_ENV} mode`)

import dotenv from 'dotenv'
import { setupDatabase } from './sequelize'
import getServer from './express'
import getSocketio from './socketio'

(async function () {
    dotenv.config()

    try {
        await setupDatabase()
        const server = getServer()
        const io = getSocketio(server)

    } catch (err) {
        console.error(err)
        process.exit(1)
    }
})()

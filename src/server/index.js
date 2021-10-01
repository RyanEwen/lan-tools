console.log(`Starting in ${process.env.NODE_ENV} mode`)

import _ from 'lodash'
import path from 'path'
import mysql2 from 'mysql2'
import express from 'express'
import sessionHandler from './session'
import passport from 'passport'
import DiscordStrategy from 'passport-discord'
import User from './models/User'
import sharedsession from 'express-socket.io-session'
import socketio from 'socket.io'
import routes from './routes'
import getState from './state'
import dotenv from 'dotenv'
import getDiscordClient, { updatePresence } from './discord'

(async () => {
    try {
        dotenv.config()

        // create database if-needed
        const connection = mysql2.createConnection({
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASS,
        })

        await connection.promise().query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE_NAME}\`;`)

        // setup oauth2 strategy
        const discordStrat = new DiscordStrategy(
            {
                clientID: process.env.DISCORD_CLIENT_ID,
                clientSecret: process.env.DISCORD_CLIENT_SECRET,
                callbackURL: process.env.DISCORD_CALLBACK_URL,
                scope: ['identify', 'email'],
            },
            async (accessToken, refreshToken, profile, cb) => {
                try {
                    const [user, userIsNew] = await User.upsert({
                        discordId: profile.id,
                        discordAvatar: profile.avatar,
                        email: profile.email,
                        name: profile.username,
                    })

                    console.log(userIsNew ? 'New user login' : 'Existing user login', user)

                    cb(null, user)

                } catch(err) {
                    cb(err, null)
                }
            }
        )

        passport.use(discordStrat)

        passport.serializeUser((user, cb) => {
            cb(null, user.id)
        })

        passport.deserializeUser((userId, cb) => {
            User.findByPk(userId).then(user => {
                cb(null, user)
            })
            .catch(err => {
                cb(err, null)
            })
        })

        // SETUP WEB SERVER

        const app = express()

        app.set('trust proxy', true)

        app.use(sessionHandler)

        app.use(passport.initialize())

        app.use(passport.session())

        // search for actual files before serving app in their place
        app.use(express.static(path.join(__dirname, '..', 'client')))
        app.use(express.static(path.join(__dirname, '..', '..', 'static')))

        // login route
        app.get('/login',
            // check if already logged in
            (req, res, next) => {
                if (!req.isAuthenticated()) {
                    return next()
                }

                res.redirect('/')
            },
            // send user to oauth2 page
            passport.authenticate('discord')
        )

        // callback route
        app.get('/callback',
            // finish oauth2 auth
            passport.authenticate('discord', { failureRedirect: '/auth/discord' }),
            // find already-connected sockets and update them of successful login
            async (req, res) => {
                const sockets = await websockets.fetchSockets()
                const sessionSockets = sockets.filter(socket => socket.handshake.session.id == req.session.id)

                sessionSockets.forEach(async (socket) => {
                    socket.join(`user-${req.session.passport.user}`)
                    socket.join('general')

                    socket.emit('user', req.user)
                    socket.emit('state', await getState())
                })

                console.log('User logged in', req.session)

                res.redirect('/')
            }
        )

        // logout route
        app.get('/logout', async (req, res) => {
            const sockets = await websockets.fetchSockets()
            const sessionSockets = sockets.filter(socket => socket.handshake.session.id == req.session.id)

            sessionSockets.forEach(socket => {
                socket.emit('user', null)
                socket.emit('state', null)

                socket.leave(`user-${req.session.passport.user}`)
                socket.leave('general')
            })

            req.logout()

            console.log('User logged out', req.session)

            res.redirect('/')
        })

        // catch-all
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'client', 'index.html'))
        })

        const http = app.listen(process.env.PORT || 3000, process.env.INTERFACE || '0.0.0.0')

        console.log('Express started')

        // SETUP WEBSOCKET SERVER

        const websockets = socketio(http)

        websockets.use(sharedsession(sessionHandler))

        websockets.on('connection', (socket) => {
            console.log('Socket connected', socket.id, socket.handshake.session.id)

            const interval = setInterval(() => {
                console.log('Socket keepalive', socket.id, socket.handshake.session.id)

                socket.handshake.session.reload(() => {
                    socket.handshake.session.touch().save()
                })
            }, 5 * 60000)

            socket.on('disconnect', () => {
                console.log('Socket disconnected', socket.id, socket.handshake.session.id)

                clearInterval(interval)
            })
        })

        websockets.on('connection', async (socket) => {
            // bind each route to a socketio event of the same name
            Object.keys(routes).forEach(routeName => {
                socket.on(routeName, async (message, res) => {
                    try {
                        // pass the socket, session, and message to the route
                        const response = await routes[routeName](socket, socket.handshake.session, message)

                        // pass the route's response back to the client
                        res(response)

                    } catch (err) {
                        console.error(err)

                        // normalize sequelize errors
                        if (err.name === 'SequelizeValidationError') {
                            res({
                                error: err.errors[0].message,
                                errors: err.errors.map((error) => error.message),
                            })
                        } else {
                            res({
                                error: err.message,
                            })
                        }
                    }
                })
            })
        })

        console.log('SocketIO started')

        // SETUP DISCORD CLIENT

        const discordClient = await getDiscordClient()

        // listen for member presence updates
        discordClient.on('presenceUpdate', async (oldPresence, newPresence) => {
            console.log('Discord presence update', oldPresence, newPresence)

            // check if a user for this member exists within the app
            const user = await User.findOne({
                where: {
                    discordId: oldPresence.user.id,
                },
            })

            // if not a user in the app then who cares
            if (!user) {
                return
            }

            // send updated state to all logged-in users
            websockets.to('general').emit('state', await getState())
        })

        // update discord status as people connect
        websockets.on('connection', async (socket) => {
            countUsersAndUpdatePresence()

            socket.on('disconnect', async () => {
                countUsersAndUpdatePresence()
            })

            async function countUsersAndUpdatePresence() {
                const sockets = await websockets.fetchSockets()
                const userIds = _.uniq(sockets.map(socket => socket.handshake.session.passport?.user).filter(userId => userId))

                updatePresence(userIds.length)
            }
        })

    } catch (err) {
        console.error(err)
        process.exit(1)
    }
})()

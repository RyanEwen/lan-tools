import SequelizeStore from 'connect-session-sequelize'
import session from 'express-session'
import getSequelize from './sequelize'

const sequelize = getSequelize()

const sessionStore = new (SequelizeStore(session.Store))({
    db: sequelize,
    tableName: 'Sessions',
    expiration: 2 * 60 * 60 * 1000,
})

export default session({
    cookie: {
        maxAge: 31 * (24 * 60 * 60 * 1000),
        secure: 'auto',
        sameSite: false,
    },
    name: 'lan-tools-session',
    saveUninitialized: true,
    secret: 'rewen',
    store: sessionStore,
    resave: false,
    proxy: true,
})

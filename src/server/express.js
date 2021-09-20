import express from 'express'
import path from 'path'
import sessionHandler from './session'

var server

export default function getServer () {
    if (server) {
        return server
    }

    const app = express()

    app.use(sessionHandler)

    app.set('trust proxy', true)

    // search for actual files before serving app in their place
    app.use(express.static(path.join(__dirname, '..', 'client')))
    app.use(express.static(path.join(__dirname, '..', '..', 'static')))

    // catch-all
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'client', 'index.html'))
    })

    server = app.listen(process.env.PORT || 3000, process.env.INTERFACE || '0.0.0.0')

    console.log('Express started')

    return server
}

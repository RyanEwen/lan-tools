import express from 'express'
import path from 'path'
import sessionHandler from './session'

export default function () {
    const app = express()

    app.use(sessionHandler)

    // search for actual files before serving app in their place
    app.use(express.static(path.join(__dirname, '..', 'client')))
    app.use(express.static(path.join(__dirname, '..', '..', 'static')))

    // catch-all
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'client', 'index.html'))
    })

    const server = app.listen(process.env.PORT || 80)

    return server
}
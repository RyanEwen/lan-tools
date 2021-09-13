console.log(`Starting in ${process.env.NODE_ENV} mode`)

import express from './express'
import socketio from './socketio'

(async function () {
    try {
        socketio(express())

    } catch (err) {
        console.error(err)
        process.exit(1)
    }
})()

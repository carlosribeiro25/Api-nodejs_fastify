import {server} from './app.js'

const port = process.env.PORT || 3333

server.listen({ port: 3333, host : "0.0.0.0" }).then(() => {
    console.log(`HTTP server runing in port ${port}`)
})


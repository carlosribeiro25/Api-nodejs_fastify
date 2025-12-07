import {server} from './app.ts'

const port = Number(process.env.PORT) || 8080

server.listen({ port, host: '0.0.0.0'}).then(() => {
    console.log(`HTTP server runing on port ${port}`)
})
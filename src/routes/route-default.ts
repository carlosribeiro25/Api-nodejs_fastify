import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import fastify from "fastify";

const server = fastify();

export const routeDefault: FastifyPluginAsyncZod = async (server) => {

    server.get('/', async (request, reply) => {
        return reply.status(200).send('Api scholl it´s workink 🎉')
    })
}
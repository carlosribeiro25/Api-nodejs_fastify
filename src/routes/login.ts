import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/cliente"
import { users } from "../database/schema"
import z from "zod";
import { verify } from "argon2";
import { eq } from "drizzle-orm";
import jwt from 'jsonwebtoken'

export const loginRouter: FastifyPluginAsyncZod = async (server) => {

    server.post('/sessions', {
        schema: {
            tags: ['Auth'],
            body: z.object({
                email: z.email(),
                password: z.string()
            }),

            response: {
                200: z.object({ token: z.string() }),
                400: z.object({ error: z.string() }),
            }
        },
    }, async (request, reply) => {
        const { password } = request.body
        const email = request.body.email.toLowerCase()

        const result = await db
            .select()
            .from(users)
            .where(eq(users.email, email))

        if (result.length === 0) {
              console.log("Email não encontrado:", email)

            return reply.status(400).send({ error: 'Credenciais inválidas' })
        }

        const user = result[0]

        const doesPasswordsMatch = await verify(user.password, password)

        if (!doesPasswordsMatch) {
            console.log("Senha inválida para:", email)

            return reply.status(400).send({ error: 'Credenciais inválidas' })
        }

        if(!process.env.JWT_SECRET){
            throw new Error('JWT_SECRET must be set.')
        }

        const token = jwt.sign({sub: user.id, role: user.role }, process.env.JWT_SECRET)

        return reply.status(200).send( {token} )
    })
}
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/cliente.ts"
import { users } from "../database/schema.ts"
import z from "zod";
import { verify } from "argon2";
import { eq } from "drizzle-orm";


export const loginRouter: FastifyPluginAsyncZod = async (server) => {

    server.post('/sessions', {
        schema: {
            tags: ['Auth'],
            body: z.object({
                email: z.email(),
                password: z.string()
            }),

            response: {
                200: z.object({ message: z.string() }),
                400: z.object({ error: z.string() })
            }
        },
    }, async (request, reply) => {
        const { email, password } = request.body

        const result = await db
            .select()
            .from(users)
            .where(eq(users.email, email))

        if (result.length === 0) {
            return reply.status(400).send({ error: 'Credenciais inválidas' })
        }

        const user = result[0]

        const doesPasswordsMatch = await verify(user.password, password)

        if (!doesPasswordsMatch) {
            return reply.status(400).send({ error: 'Credenciais inválidas' })
        }

        return reply.status(200).send({ message: 'OK'})
    })
}
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod" 
import { db } from "../database/cliente"
import { courses } from "../database/schema"
import z from "zod"
import { eq } from 'drizzle-orm'
import { checkRequestJwt } from "./hooks/check-req-jwt"
import { getAuthenticatedUser } from "./utils/get-authenticated-use"

export const getCourseByIDRoute: FastifyPluginAsyncZod =  async(server) => {

server.get('/courses/:id',{
    preHandler: [
        checkRequestJwt,
    ],
    schema: {
        tags: ['Courses'],
        params: z.object({
            id: z.uuid()
        }), 
        response: {
            200: z.object({
                course: z.object({
                    id: z.uuid(),
                    title: z.string(),
                    description: z.string().nullable(),
                })
            }),
            404: z.object({error: z.string()}).describe('Curso nao encontrado!')
        },
    },
}, async (request, reply) => {
    
    const user = getAuthenticatedUser(request)

    const courseId = request.params.id

    const result = await db
    .select().
    from(courses)
    .where(eq(courses.id, courseId))

    if (result.length > 0) {
        return { course: result[0] }
    }

    return reply.status(404).send({error: 'Curso não encontrado'});
})
}
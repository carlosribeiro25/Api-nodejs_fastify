import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod" 
import { db } from "../database/cliente.ts"
import { courses } from "../database/schema.ts"
import z from "zod"
import { eq } from 'drizzle-orm'
import { title } from "process"
import { error } from "console"

export const getCourseByIDRoute: FastifyPluginAsyncZod =  async(server) => {

server.get('/courses/:id',{
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

            404: z.object({error: z.string()}).describe('Curso nao esncontrado.')
        },
    },
}, async (request, reply) => {
   
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
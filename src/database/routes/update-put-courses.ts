import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod" 
import { db } from "../cliente.ts"
import { courses } from "../schema.ts"
import z from "zod"
import { eq } from 'drizzle-orm'

export const updateCourseRoutePut: FastifyPluginAsyncZod =  async(server) => {

server.put('/courses/:id', {
    schema:{
        tags: ['Courses'],
        params: z.object({
            id: z.uuid()
        }),

        body: z.object({
            title: z.string().min(5, 'Título deve ter no mínimo 5 caracteres!'),
            description: z.string().min(10,'Descrição ter no mínimo 10 caracteres!')
        })
    }
}, async (request, reply) => {    
        const { id } = request.params 
        const { title, description } = request.body

        const result = await db
            .update(courses)
            .set({ title, description })
            .where(eq(courses.id, id))
            .returning();

        if (result.length === 0) {
            return reply.status(404).send({ error: 'Curso nao encontrado' })
        }

        return reply.status(200).send({ message: 'Curso atualizado com sucesso', course: result[0] })
})
}
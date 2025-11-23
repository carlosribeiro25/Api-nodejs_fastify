import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod" 
import { db } from "../cliente.ts"
import { courses } from "../schema.ts"
import z from "zod"


export const getCourseRoute: FastifyPluginAsyncZod =  async(server) => {

server.get('/courses', {
    schema: {
        tags: ['Courses'],
         description: 'Nessa rota o titulo e  a descrição são obrigatórios',
        summary: 'Essa rota lista todos os cursos.',
        response: {
            200: z.object({
                courses: z.array(z.object({
                id: z.uuid(),
                title: z.string(),
                description: z.string().nullable()
            })
        )            
    })       
  }
   
}
}, async (request, reply) => {
    const result = await db
    .select()
    .from(courses)

    return reply.send({courses: result})
})
}


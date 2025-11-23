import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod" 
import { db } from "../cliente.ts"
import { courses } from "../schema.ts"
import z from "zod"
import { eq } from 'drizzle-orm'


export const deleteCourseRoute: FastifyPluginAsyncZod =  async(server) => {
server.delete('/courses/:id' , {
    schema: {
        tags: ['Courses'],
        params: z.object({
            id: z.uuid()
        }),
        response: {
            200: z.string(),
            404: z.string()
        }
    }
}, async (request, reply) => {

    const {id} = request.params 

     const result = await db.delete(courses)
    .where(eq(courses.id, id))
    .returning()
    
    if(result.length > 0){
        reply.status(200).send(`Curso deletado com sucesso  `)
    } else {
        reply.status(404).send("Curso nao encontrado!" )
    }
})

}
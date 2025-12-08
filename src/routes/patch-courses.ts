import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod" 
import { db } from "../database/cliente"
import { courses } from "../database/schema"
import  z from "zod"
import { eq } from 'drizzle-orm'
import { checkRequestJwt } from "./hooks/check-req-jwt"
import { checkUserRole } from "./hooks/check-user-role"

export const updateCourseRoutePatch: FastifyPluginAsyncZod =  async(server) => {

server.patch('/courses/:id', {
    preHandler: [
                checkRequestJwt,
                checkUserRole('manager'),
            ],
    schema:{
        tags: ['Courses'],
        params: z.object({
            id: z.uuid()
        }),
        additionalProperties: true,
        body: z.object({
            title: z.string().min(5, 'O titulo deve ter no minimo 5 caracteres!').optional(),
            description: z.string().min(10, 'O titulo deve ter no minimo 5 caracteres!').optional()
        })
    }
}, async (request, reply) => {
    const {id} = request.params
    const body = request.body

    const updated = await db
    .update(courses)
    .set(body)
    .where(eq(courses.id, id))
    .returning();

    if(!updated.length ){
        return reply.status(404).send({ error:'Curso não encontrado'})
    }  
      return  reply.status(200).send({ message:'Curso atualizado com sucesso', courses: updated[0] })
        
});
}
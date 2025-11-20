
import fastify from "fastify"
import { db } from "./src/database/cliente.ts"
import { courses } from "./src/database/schema.ts"
import { eq } from "drizzle-orm"
import { validatorCompiler, serializerCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

const server = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },
}).withTypeProvider<ZodTypeProvider>()

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler); 

server.get('/courses', async (request, reply) => {
    const result = await db.select().from(courses)
    return reply.send({courses: result})
})

server.get('/courses/:id',{
    schema: {
        params: z.object({
            id: z.uuid()
        })
    }
}, async (request, reply) => {
   
    const courseId = request.params.id

    const result = await db
    .select().
    from(courses)
    .where(eq(courses.id, courseId))

    if (result.length > 0) {
        return { course: result[0] }
    }

    return reply.status(404).send(" Curso Nao encontrado!")
})

server.post('/courses', {
    schema:{
        body: z.object({
            title: z.string().min(5, 'Título deve ter no mínimo 5 caracteres!'),
            description: z.string().min(8, 'Descrição ter no mínimo 10 caracteres!')
        })
    },
}, async (request, reply) => {
   
    const courseTitle = request.body.title
    const courseDescription = request.body.description

    try {
          const result = await db
   .insert(courses)
   .values({title: courseTitle,description: courseDescription})
   .returning()

    return reply.status(201).send({ courseId: result[0].id})

    } catch (error) {
        return reply.status(500).send({error: 'Falha ao criar o curso' })
    }
});

server.delete('/courses/:id' , {
    schema: {
        params: z.object({
            id: z.string()
        })
    }
}, async (request, reply) => {

    const {id} = request.params 

     const result = await db.delete(courses)
    .where(eq(courses.id, id))
    .returning()
    
    if(result.length > 0){
        reply.status(200).send(`Curso deletado com sucesso`)
    } else {
        reply.status(404).send("Curso nao encontrado!")
    }
})

server.put('/courses/:id', {
    schema:{
        params: z.object({
            id: z.string()
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

server.listen({ port: 3333 }).then(() => {
    console.log("HTTP server runing!")
})
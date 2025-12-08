import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/cliente"
import { courses } from "../database/schema"
import z from "zod"
import { checkRequestJwt } from "./hooks/check-req-jwt"
import { checkUserRole } from "./hooks/check-user-role"


export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
    server.post('/courses', {
        preHandler: [
            checkRequestJwt,
            checkUserRole('manager'),
        ],
        schema: {
            tags: ['Courses'],
            description: 'Nessa rota o titulo e  a descrição são obrigatórios',
            body: z.object({
                title: z.string().min(5, 'Título deve ter no mínimo 5 caracteres!'),
                description: z.string().min(8, 'Descrição ter no mínimo 10 caracteres!')
            }),

            response: {
                201: z.object({ courseId: z.uuid() }).describe('Curso criado com sucesso!'),
                400: z.object({ error: z.string() })
            }
        },
    }, async (request, reply) => {
        const courseTitle = request.body.title
        const courseDescription = request.body.description

        try {
            const result = await db
                .insert(courses)
                .values({ title: courseTitle, description: courseDescription })
                .returning()

            return reply.status(201).send({ courseId: result[0].id })
        } catch (error) {
            return reply.status(400).send({ error: 'Falha ao criar o curso' })
        }
    })
}
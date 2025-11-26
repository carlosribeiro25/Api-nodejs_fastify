import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod" 
import { db } from "../cliente.ts"
import { courses } from "../schema.ts"
import { ilike, asc, and, SQL} from "drizzle-orm"
import z from "zod"

export const getCourseRoute: FastifyPluginAsyncZod =  async(server) => {

server.get('/courses', {
    schema: {
        tags: ['Courses'],
        summary: 'Essa rota lista todos os cursos.',
        querystring: z.object({
            search: z.string().optional(),
            orderBy: z.enum(['id', 'title']).optional().default('id'),
            page: z.coerce.number().optional().default(1)
        }
    ),
        response: {
            200: z.object({
                courses: z.array(
                z.object({
                id: z.uuid(),
                title: z.string(),
                description: z.string().nullable()
            })
        ),
        total : z.number(),            
    })       
  }
   
}
}, async (request, reply) => {
    const { search, orderBy, page } = request.query
    
    const conditions : SQL[] = []

    if (search) {
        conditions.push(ilike(courses.title, `%${search}%`))
    }

    const [result, total] = await  Promise.all([
        db
        .select()
        .from(courses)
        .orderBy(asc(courses[orderBy]))
        .offset((page - 1) *2)
        .limit(3)
        .where(and(...conditions)),

        db.$count(courses, and(...conditions))
    ])

    return reply.send({courses: result, total})
})
}


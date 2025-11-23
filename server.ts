
import fastify from "fastify"
import { validatorCompiler, serializerCompiler, 
type ZodTypeProvider,  jsonSchemaTransform } from 'fastify-type-provider-zod'
import { fastifySwagger } from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import { createCourseRoute } from "./src/database/routes/create-courses.ts"
import { getCourseRoute } from "./src/database/routes/get-courses.ts"
import { getCourseByIDRoute } from "./src/database/routes/get-coursesById.ts"
import { updateCourseRoutePatch } from "./src/database/routes/update-patch-courses.ts"
import { updateCourseRoutePut } from "./src/database/routes/update-put-courses.ts"
import { deleteCourseRoute } from "./src/database/routes/delete-courses.ts"


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

if(process.env.NODE_ENV === 'development') {
    server.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'API com Node js',
            version: '1.0.0',
        }
    },

    transform: jsonSchemaTransform,
});

server.register(fastifySwaggerUi,  {
  routePrefix: '/docs',
}) 

}
server.register(createCourseRoute)
server.register(getCourseRoute)
server.register(getCourseByIDRoute)
server.register(updateCourseRoutePatch)
server.register(updateCourseRoutePut)
server.register(deleteCourseRoute)

server.listen({ port: 3333 }).then(() => {
    console.log("HTTP server runing!")
})
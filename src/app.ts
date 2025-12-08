
import fastify from "fastify"
import { validatorCompiler, serializerCompiler, 
type ZodTypeProvider,  jsonSchemaTransform } from 'fastify-type-provider-zod'
import { fastifySwagger } from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import { createCourseRoute } from "./routes/create-courses"
import { getCourseRoute } from "./routes/get-courses"
import { getCourseByIDRoute } from "./routes/get-coursesById"
import { updateCourseRoutePatch } from "./routes/patch-courses"
import { updateCourseRoutePut } from "./routes/put-courses"
import { deleteCourseRoute } from "./routes/delete-courses"
import { loginRouter } from "./routes/login"


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
server.register(loginRouter)

export {server}
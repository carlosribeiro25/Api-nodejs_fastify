
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
import { routeDefault } from "./routes/route-default"



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

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'API School',
      description: 'API de gerenciamento de alunos e cursos',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'https://api-nodejs-fastify.fly.dev',
        description: 'Produção'
      },
      {
        url: 'http://localhost:3333',
        description: 'Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  transform: jsonSchemaTransform,
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true
  }, 
  staticCSP: true
}) 

server.register(routeDefault)
server.register(createCourseRoute)
server.register(getCourseRoute)
server.register(getCourseByIDRoute)
server.register(updateCourseRoutePatch)
server.register(updateCourseRoutePut)
server.register(deleteCourseRoute)
server.register(loginRouter)

export {server}
// const fastify = require('fastify');
// const crypto = require('crypto');

import fastify from "fastify"
import crypto from "node:crypto"

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
})

const courses = [
    { id: '1', title: 'Curso de React' },
    { id: '2', title: 'Curso de MongoDB' },
    { id: '3', title: 'Curso de Javascript' }
]

server.get('/courses', (request, reply) => {
    return reply.send({ courses })
})

server.get('/courses/:id', (request, reply) => {
    type Params = {
        id: string
    }

    const params = request.params as Params

    const courseId = params.id

    const course = courses.find(course => course.id === courseId)

    if (course) {
        return { course }
    }

    return reply.status(404).send(" Curso Nao encontrado!")
})

server.post('/courses', (request, reply) => {
    type Body = {
        title: string
    }
    const body = request.body as Body

    const courseId = crypto.randomUUID()
    const courseTitle = body.title

    if (!courseTitle) {
        return reply.status(201).send({ courseId })
    }

    courses.push({ id: courseId, title: courseTitle })
    return reply.status(201).send({ courseId })

});

server.delete('/courses/:id', (request, reply) => {

    type Params = {
        id: string
    }

    const { id } = request.params as Params

    const courseIndex = courses.findIndex(course => course.id === id)

    if (courseIndex !== -1) {
        const removedCourse = courses.splice(courseIndex, 1)
        return reply.status(200).send({ message: `Curso ${removedCourse[0].title} deletado com sucesso!` });
    } else {
        return reply.status(404).send({ message: 'Curso não encontrado' })
    }
});

server.put('/courses/:id', (request, reply) => {

    type Params = {
        id: string
    }

    type Body = {
        title?: string
    }

    const { id } = request.params as Params
    const { title } = (request.body as Body) || {}

    const courseIndex = courses.findIndex(c => c.id === id)

    if (courseIndex === -1) {
        return reply.status(404).send({ message: 'Curso não encontrado' })
    }

    if (!title) {
        return reply.status(400).send({ message: 'Campo "title" é obrigatório' })
    }

    courses[courseIndex].title = title

    return reply.status(200).send({ message: 'Curso atualizado com sucesso', course: courses[courseIndex] })

})


server.listen({ port: 3333 }).then(() => {
    console.log("HTTP server runing!")
})
import { test, expect } from 'vitest';
import request from 'supertest';
import { server } from '../../app'
import { makeCourse } from '../../test/factories/make-course';
import { makeAuthenticatedUser } from '../../test/factories/make-user';

test('Return a course by Id ', async () => {
    await server.ready()

    const { token } = await makeAuthenticatedUser('student')
    const course = await makeCourse()

    const response = await request(server.server)
        .get(`/courses/${course.id}`)
        .set('Authorization', token)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
        course: {
            id: expect.any(String),
            title: expect.any(String),
            description: expect.any(String)
        }
    })
})

test('return 404 if course not exist', async () => {
    await server.ready()

    const { token } = await makeAuthenticatedUser('student')
    const response = await request(server.server)

        .get(`/courses/134597d8-34aa-4ea8-ba68-a3a2fa25a7a8`)
        .set('Authorization', token)

    expect(response.status).toEqual(404)
})
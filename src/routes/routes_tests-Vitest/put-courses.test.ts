import { test, expect } from 'vitest';
import request from 'supertest';
import { server } from '../../app.ts'
import { faker } from '@faker-js/faker';
import { makeCourse } from '../../test/factories/make-course.ts';

test('Curso atualizado com sucesso!', async () => {
  await server.ready()

  const course = await makeCourse()

  const response = await request(server.server)
    .put(`/courses/${course.id}`)
    .set('Content-Type', 'application/json')
    .send({ title: faker.lorem.words(4), description: faker.lorem.words(4) },
    )

  expect(response.status).toEqual(200)

  expect(response.body).toEqual({
    message: "Curso atualizado com sucesso",
    course: {
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String)
    }
  })
})

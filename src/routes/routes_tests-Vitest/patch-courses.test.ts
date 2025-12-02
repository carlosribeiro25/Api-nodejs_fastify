import { test, expect } from 'vitest';
import request from 'supertest';
import { server } from '../../app.ts'
import { faker } from '@faker-js/faker';
import { makeCourse } from '../../test/factories/make-course.ts';
import { courses } from '../../database/schema.ts';

test('Curso atualizado com sucesso!', async () => {
  await server.ready()

  const course = await makeCourse()

  const response = await request(server.server)
    .patch(`/courses/${course.id}`)
    .set('Content-Type', 'application/json')
    .send({ title: faker.lorem.words(4) }
    )

  expect(response.status).toEqual(200)

  expect(response.body).toEqual({
    message: "Curso atualizado com sucesso",
    courses: {
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String) || null
    }
  })
})

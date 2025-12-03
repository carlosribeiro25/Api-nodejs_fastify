import { test, expect } from 'vitest';
import request from 'supertest';
import { server } from '../../app.ts'
import { faker } from '@faker-js/faker';
import { makeAuthenticatedUser } from '../../test/factories/make-user.ts'


test('Curso atualizado com sucesso!', async () => {
  await server.ready()
  const { token } = await makeAuthenticatedUser('manager')

  const response = await request(server.server)
    .put(`/courses/073fcefa-4a55-41a0-a4fe-74c6eff25130`)
    .set('Content-Type', 'application/json')
    .set('Authorization', token)
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

test('Course not found', async () => {
  await server.ready()
  const { token } = await makeAuthenticatedUser('manager')

 const response = await request(server.server)
    .put(`/courses/073fcefa-4a55-41a0-a4fe-74c6eff65140`)
    .set('Content-Type', 'application/json')
    .set('Authorization', token)
    .send({ title: faker.lorem.words(4), description: faker.lorem.words(4) },
    )

  expect(response.status).toEqual(404)
  expect(response.body).toEqual({
    error: "Curso não encontrado"
  })
})

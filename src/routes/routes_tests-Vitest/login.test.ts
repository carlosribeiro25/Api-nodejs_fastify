import { test, expect } from 'vitest';
import request from 'supertest';
import { server } from '../../app'
import { makeUser } from '../../test/factories/make-user';

test('login', async () => {
  await server.ready()

  const { user, passwordBeforeHash } = await makeUser()

  const response = await request(server.server)
    .post('/sessions')
    .set('Content-Type', 'application/json')
    .send(
        { 
          email: user.email,
          password: passwordBeforeHash, 
        },
    )

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    token: expect.any(String),
  })
})

test('Credenciais inválidas', async () => {
  await server.ready()

  const { user, passwordBeforeHash } = await makeUser()

  const response = await request(server.server)
    .post('/sessions')
    .set('Content-Type', 'application/json')
    .send(
        { 
            email: user.name,
            password: passwordBeforeHash, 
        },
    )

  expect(response.status).toEqual(400)
  expect(response.body).toEqual({
    error: 'Bad Request'
  })
})

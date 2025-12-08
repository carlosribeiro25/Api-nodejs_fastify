import { test, expect } from 'vitest';
import request from 'supertest';
import { server } from '../../app'
import { makeCourse } from '../../test/factories/make-course';
import { makeAuthenticatedUser } from '../../test/factories/make-user'

test('Delete a course', async () => {
  await server.ready()
  const { token } = await makeAuthenticatedUser('manager')
  const course = await makeCourse()

  const response = await request(server.server)
    .delete(`/courses/${course.id}`)
    .set('Authorization', token)

  expect(response.status).toEqual(200)
  expect(response.body).toEqual(
    {}
  )
})

test('Return 404 if course not exist', async () => {
  await server.ready()

  const { token } = await makeAuthenticatedUser('manager')
  

  const response = await request(server.server)
    .delete(`/courses/134597d8-31aa-4ea8-ba68-a3a2fa25a7ac`)
    .set('Authorization', token)

      expect(response.status).toEqual(404)
       expect(response.body).toEqual(
    {}
  )
});

import { test, expect } from 'vitest';
import request from 'supertest';
import { server } from '../../app'
import { randomUUID } from 'crypto';
import { makeCourse } from '../../test/factories/make-course';
import {makeAuthenticatedUser} from '../../test/factories/make-user'


test('Get Courses ', async () => {
   await server.ready()
    const { token } = await makeAuthenticatedUser('manager')

   const titleId = randomUUID()

   const course = await makeCourse()

   const response = await request(server.server)
      .get(`/courses?search=${titleId}`)
      .set('Authorization', token)

   expect(response.status).toEqual(200)
   expect(response.body).toEqual({
      total: 0,
      courses: [],
   })
})
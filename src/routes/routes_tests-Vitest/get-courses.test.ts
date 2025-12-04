import { test, expect } from 'vitest';
import request from 'supertest';
import { server } from '../../app.ts'
import { randomUUID } from 'crypto';
import { makeCourse } from '../../test/factories/make-course.ts';
import {makeAuthenticatedUser} from '../../test/factories/make-user.ts'


test('Get Courses ', async () => {
   await server.ready()
    const { token } = await makeAuthenticatedUser('manager')

   const titleId = randomUUID()

   const response = await request(server.server)
      .get(`/courses?search=${titleId}`)
      .set('Authorization', token)

   expect(response.status).toEqual(200)
   expect(response.body).toEqual({
      total: 0,
      courses: [],
   })
})
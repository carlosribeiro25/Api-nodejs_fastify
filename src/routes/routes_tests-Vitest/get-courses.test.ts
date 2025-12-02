import { test , expect } from 'vitest';
import  request  from 'supertest';
import { server } from '../../app.ts'
import { randomUUID } from 'crypto';
import { makeCourse } from '../../test/factories/make-course.ts';


test('Get Courses ', async () => {
    await server.ready()

    const titleId = randomUUID()

    const course = await makeCourse()

    const response = await request(server.server)
      .get(`/courses?search=${titleId}`)

   expect(response.status).toEqual(200)
   expect(response.body).toEqual({
    total: 0,
    courses: [],
   })
})
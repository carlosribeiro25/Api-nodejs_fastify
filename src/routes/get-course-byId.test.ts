import { test , expect } from 'vitest';
import  request  from 'supertest';
import { server } from '../app.ts'
import { makeCourse } from '../test/factories/make-course.ts';

test('Return a course not found', async () => {
    await server.ready()

    const course = await makeCourse()

    const response = await request(server.server)
      .get(`/courses/022edd88-2797-4653-96cf-95fa1f48d8a7`)

    expect(response.status).toEqual(404)
   
})

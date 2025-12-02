import { test , expect } from 'vitest';
import  request  from 'supertest';
import { server } from '../../app.ts'
import { makeCourse } from '../../test/factories/make-course.ts';

test('Delete a course', async () => {
    await server.ready()

    const course = await makeCourse()

    const response = await request(server.server)
      .delete(`/courses/${course.id}`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
        {}   
    )
})

import { courses, enrollments, users } from "./schema.ts";
import { db } from "./cliente.ts";
import {fakerPT_BR as faker} from '@faker-js/faker'


async function seed() {
    const usersInserts = await db.insert(users).values([
        {
            name: faker.person.fullName(), 
            email: faker.internet.email(),
            password: '',
            role: 'student'
        },
         {
            name: faker.person.fullName(), 
            email: faker.internet.email(),
            password: '',
            role: 'student'
        },
         {
            name: faker.person.fullName(), 
            email: faker.internet.email(),
            password: '',
            role: 'student'
        },
         {
            name: faker.person.fullName(), 
            email: faker.internet.email(),
            password: '',
            role: 'student'
        },
    ]).returning()

    const coursesInsert = await db.insert(courses).values([
        {title: faker.lorem.words(4), description: faker.lorem.words(3)},
        {title: faker.lorem.words(4), description: faker.lorem.words(3)},
        {title: faker.lorem.words(4), description: faker.lorem.words(3)},
        {title: faker.lorem.words(4), description: faker.lorem.words(3)},
    ]).returning()

    await db.insert(enrollments).values([
        {courseId: coursesInsert[0].id, userId: usersInserts[0].id },
        {courseId: coursesInsert[0].id, userId: usersInserts[1].id },
        {courseId: coursesInsert[1].id, userId: usersInserts[1].id },
        {courseId: coursesInsert[2].id, userId: usersInserts[2].id },
    ])
}

seed();
import { faker } from "@faker-js/faker"
import { db } from "../../database/cliente.ts"
import { courses } from "../../database/schema.ts"
import  { randomUUID } from 'node:crypto'

export async function makeCourse() {
    
    const result = await db.insert(courses).values({
        id: randomUUID(),
        title: faker.lorem.words(4),
        description: faker.lorem.words(4),
    }).returning()

    return result[0]
}

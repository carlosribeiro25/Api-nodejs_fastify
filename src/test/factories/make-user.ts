import { faker } from "@faker-js/faker"
import { db } from "../../database/cliente.ts"
import {  users } from "../../database/schema.ts"
import  { randomUUID } from 'node:crypto'
import { hash } from "argon2"

export async function makeUser() {
    const passwordBeforeHash = randomUUID()
    
    const result = await db.insert(users).values({
        id: randomUUID(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: await hash(passwordBeforeHash)
    }).returning()

    return {
        user: result[0],
        passwordBeforeHash,
    }
}

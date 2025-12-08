"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_ts_1 = require("./schema.ts");
const cliente_ts_1 = require("./cliente.ts");
const faker_1 = require("@faker-js/faker");
const argon2_1 = require("argon2");
async function seed() {
    const passwordHash = await (0, argon2_1.hash)('214580');
    const usersInserts = await cliente_ts_1.db.insert(schema_ts_1.users).values([
        {
            name: faker_1.fakerPT_BR.person.fullName(),
            email: faker_1.fakerPT_BR.internet.email(),
            password: passwordHash,
            role: 'student'
        },
        {
            name: faker_1.fakerPT_BR.person.fullName(),
            email: faker_1.fakerPT_BR.internet.email(),
            password: passwordHash,
            role: 'student'
        },
        {
            name: faker_1.fakerPT_BR.person.fullName(),
            email: faker_1.fakerPT_BR.internet.email(),
            password: passwordHash,
            role: 'student'
        },
        {
            name: faker_1.fakerPT_BR.person.fullName(),
            email: faker_1.fakerPT_BR.internet.email(),
            password: passwordHash,
            role: 'student'
        },
    ]).returning();
    const coursesInsert = await cliente_ts_1.db.insert(schema_ts_1.courses).values([
        { title: faker_1.fakerPT_BR.lorem.words(4), description: faker_1.fakerPT_BR.lorem.words(3) },
        { title: faker_1.fakerPT_BR.lorem.words(4), description: faker_1.fakerPT_BR.lorem.words(3) },
        { title: faker_1.fakerPT_BR.lorem.words(4), description: faker_1.fakerPT_BR.lorem.words(3) },
        { title: faker_1.fakerPT_BR.lorem.words(4), description: faker_1.fakerPT_BR.lorem.words(3) },
    ]).returning();
    await cliente_ts_1.db.insert(schema_ts_1.enrollments).values([
        { courseId: coursesInsert[0].id, userId: usersInserts[0].id },
        { courseId: coursesInsert[0].id, userId: usersInserts[1].id },
        { courseId: coursesInsert[1].id, userId: usersInserts[1].id },
        { courseId: coursesInsert[2].id, userId: usersInserts[2].id },
    ]);
}
seed();

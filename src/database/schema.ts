
// import { pgTable, uuid, text, check } from 'drizzle-orm/pg-core';
// import { sql } from 'drizzle-orm/sql';

// export const users = pgTable('users', {
//     id: uuid().primaryKey().defaultRandom(),
//     name: text().notNull(),
//     email: text().notNull().unique()
// })

// export const courses = pgTable('courses', {
//     id: uuid().primaryKey().defaultRandom(),
//     title: text().notNull().unique(),
//     description: text()
// }, (table) => ({
//     titleLengthCheck: check('title_length_check', sql`length(${table.title}) >= 5`),
//     descriptionLengthCheck: check('description_length_check', sql`length(${table.description}) >= 10`)
// })) 

import { pgTable, uuid, text, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm/sql';

export const users = pgTable('users', {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    email: text().notNull().unique()
})

export const courses = pgTable('courses', {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull().unique(),
    description: text()
},(table) => ({
    titleLengthCheck: check('title_length_check', sql`length(${table.title}) >= 5`),
    descriptionLengthCheck: check('description_length_check', sql`length(${table.description}) >= 10`)
}))

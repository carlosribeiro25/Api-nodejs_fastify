
import { uniqueIndex } from 'drizzle-orm/pg-core';
import { uuid, text, check, timestamp, pgEnum, pgTable } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm/sql';

 export const userRole = pgEnum('user_role', [
    'student',
    'manager'
])

export const users = pgTable('users', {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    email: text().notNull().unique(),
    password: text().notNull(),
    role: userRole().notNull().default('student'),
}, (table) => ({
    nameLengthCheck: check('name_length_check', sql`length(${table.name}) >= 5`),
    emailLengthCheck: check('email_length_check', sql`length(${table.email}) >= 10`)
}))

export const courses = pgTable('courses', {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull().unique(),
    description: text()
},(table) => ({
    titleLengthCheck: check('title_length_check', sql`length(${table.title}) >= 5`),
    descriptionLengthCheck: check('description_length_check', sql`length(${table.description}) >= 10`)
}))

export const enrollments = pgTable('enrollments', {
    id: uuid().primaryKey().defaultRandom(),
    userId : uuid().notNull().references(() => users.id),
    courseId: uuid().notNull().references(() => courses.id),
    createdAt: timestamp({withTimezone: true}).notNull().defaultNow()
}, (table) => ({
    uniqueEnrollment: uniqueIndex().on(table.userId, table.courseId)
}))
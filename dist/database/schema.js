"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollments = exports.courses = exports.users = exports.userRole = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const pg_core_2 = require("drizzle-orm/pg-core");
const sql_1 = require("drizzle-orm/sql");
exports.userRole = (0, pg_core_2.pgEnum)('user_role', [
    'student',
    'manager'
]);
exports.users = (0, pg_core_2.pgTable)('users', {
    id: (0, pg_core_2.uuid)().primaryKey().defaultRandom(),
    name: (0, pg_core_2.text)().notNull(),
    email: (0, pg_core_2.text)().notNull().unique(),
    password: (0, pg_core_2.text)().notNull(),
    role: (0, exports.userRole)().notNull().default('student'),
}, (table) => ({
    nameLengthCheck: (0, pg_core_2.check)('name_length_check', (0, sql_1.sql) `length(${table.name}) >= 5`),
    emailLengthCheck: (0, pg_core_2.check)('email_length_check', (0, sql_1.sql) `length(${table.email}) >= 10`)
}));
exports.courses = (0, pg_core_2.pgTable)('courses', {
    id: (0, pg_core_2.uuid)().primaryKey().defaultRandom(),
    title: (0, pg_core_2.text)().notNull().unique(),
    description: (0, pg_core_2.text)()
}, (table) => ({
    titleLengthCheck: (0, pg_core_2.check)('title_length_check', (0, sql_1.sql) `length(${table.title}) >= 5`),
    descriptionLengthCheck: (0, pg_core_2.check)('description_length_check', (0, sql_1.sql) `length(${table.description}) >= 10`)
}));
exports.enrollments = (0, pg_core_2.pgTable)('enrollments', {
    id: (0, pg_core_2.uuid)().primaryKey().defaultRandom(),
    userId: (0, pg_core_2.uuid)().notNull().references(() => exports.users.id),
    courseId: (0, pg_core_2.uuid)().notNull().references(() => exports.courses.id),
    createdAt: (0, pg_core_2.timestamp)({ withTimezone: true }).notNull().defaultNow()
}, (table) => ({
    uniqueEnrollment: (0, pg_core_1.uniqueIndex)().on(table.userId, table.courseId)
}));

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_ts_1 = require("../../app.ts");
const make_course_ts_1 = require("../../test/factories/make-course.ts");
const make_user_ts_1 = require("../../test/factories/make-user.ts");
(0, vitest_1.test)('Return a course by Id ', async () => {
    await app_ts_1.server.ready();
    const { token } = await (0, make_user_ts_1.makeAuthenticatedUser)('student');
    const course = await (0, make_course_ts_1.makeCourse)();
    const response = await (0, supertest_1.default)(app_ts_1.server.server)
        .get(`/courses/${course.id}`)
        .set('Authorization', token);
    (0, vitest_1.expect)(response.status).toEqual(200);
    (0, vitest_1.expect)(response.body).toEqual({
        course: {
            id: vitest_1.expect.any(String),
            title: vitest_1.expect.any(String),
            description: vitest_1.expect.any(String)
        }
    });
});
(0, vitest_1.test)('return 404 if course not exist', async () => {
    await app_ts_1.server.ready();
    const { token } = await (0, make_user_ts_1.makeAuthenticatedUser)('student');
    const response = await (0, supertest_1.default)(app_ts_1.server.server)
        .get(`/courses/134597d8-34aa-4ea8-ba68-a3a2fa25a7a8`)
        .set('Authorization', token);
    (0, vitest_1.expect)(response.status).toEqual(404);
});

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
(0, vitest_1.test)('Delete a course', async () => {
    await app_ts_1.server.ready();
    const { token } = await (0, make_user_ts_1.makeAuthenticatedUser)('manager');
    const course = await (0, make_course_ts_1.makeCourse)();
    const response = await (0, supertest_1.default)(app_ts_1.server.server)
        .delete(`/courses/${course.id}`)
        .set('Authorization', token);
    (0, vitest_1.expect)(response.status).toEqual(200);
    (0, vitest_1.expect)(response.body).toEqual({});
});
(0, vitest_1.test)('Return 404 if course not exist', async () => {
    await app_ts_1.server.ready();
    const { token } = await (0, make_user_ts_1.makeAuthenticatedUser)('manager');
    const response = await (0, supertest_1.default)(app_ts_1.server.server)
        .delete(`/courses/134597d8-31aa-4ea8-ba68-a3a2fa25a7ac`)
        .set('Authorization', token);
    (0, vitest_1.expect)(response.status).toEqual(404);
    (0, vitest_1.expect)(response.body).toEqual({});
});

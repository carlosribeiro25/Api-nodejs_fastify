"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_ts_1 = require("../../app.ts");
const faker_1 = require("@faker-js/faker");
const make_user_ts_1 = require("../../test/factories/make-user.ts");
(0, vitest_1.test)('Criar um curso', async () => {
    await app_ts_1.server.ready();
    const { token } = await (0, make_user_ts_1.makeAuthenticatedUser)('manager');
    const response = await (0, supertest_1.default)(app_ts_1.server.server)
        .post('/courses')
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ title: faker_1.faker.lorem.words(4), description: faker_1.faker.lorem.words(4) });
    (0, vitest_1.expect)(response.status).toEqual(201);
    (0, vitest_1.expect)(response.body).toEqual({
        courseId: vitest_1.expect.any(String)
    });
});
(0, vitest_1.test)('Bad Request', async () => {
    await app_ts_1.server.ready();
    const { token } = await (0, make_user_ts_1.makeAuthenticatedUser)('manager');
    const response = await (0, supertest_1.default)(app_ts_1.server.server)
        .post('/courses')
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ title: faker_1.faker.lorem.words(0), description: faker_1.faker.lorem.words(1) });
    (0, vitest_1.expect)(response.status).toEqual(400);
    (0, vitest_1.expect)(response.body).toEqual({ error: "Bad Request" });
});

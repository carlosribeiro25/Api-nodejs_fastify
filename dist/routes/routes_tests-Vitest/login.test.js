"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_ts_1 = require("../../app.ts");
const make_user_ts_1 = require("../../test/factories/make-user.ts");
(0, vitest_1.test)('login', async () => {
    await app_ts_1.server.ready();
    const { user, passwordBeforeHash } = await (0, make_user_ts_1.makeUser)();
    const response = await (0, supertest_1.default)(app_ts_1.server.server)
        .post('/sessions')
        .set('Content-Type', 'application/json')
        .send({
        email: user.email,
        password: passwordBeforeHash,
    });
    (0, vitest_1.expect)(response.status).toEqual(200);
    (0, vitest_1.expect)(response.body).toEqual({
        token: vitest_1.expect.any(String),
    });
});
(0, vitest_1.test)('Credenciais inválidas', async () => {
    await app_ts_1.server.ready();
    const { user, passwordBeforeHash } = await (0, make_user_ts_1.makeUser)();
    const response = await (0, supertest_1.default)(app_ts_1.server.server)
        .post('/sessions')
        .set('Content-Type', 'application/json')
        .send({
        email: user.name,
        password: passwordBeforeHash,
    });
    (0, vitest_1.expect)(response.status).toEqual(400);
    (0, vitest_1.expect)(response.body).toEqual({
        error: 'Bad Request'
    });
});

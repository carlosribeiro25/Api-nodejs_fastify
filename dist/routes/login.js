"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRouter = void 0;
const cliente_ts_1 = require("../database/cliente.ts");
const schema_ts_1 = require("../database/schema.ts");
const zod_1 = __importDefault(require("zod"));
const argon2_1 = require("argon2");
const drizzle_orm_1 = require("drizzle-orm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginRouter = async (server) => {
    server.post('/sessions', {
        schema: {
            tags: ['Auth'],
            body: zod_1.default.object({
                email: zod_1.default.email(),
                password: zod_1.default.string()
            }),
            response: {
                200: zod_1.default.object({ token: zod_1.default.string() }),
                400: zod_1.default.object({ error: zod_1.default.string() }),
            }
        },
    }, async (request, reply) => {
        const { email, password } = request.body;
        const result = await cliente_ts_1.db
            .select()
            .from(schema_ts_1.users)
            .where((0, drizzle_orm_1.eq)(schema_ts_1.users.email, email));
        if (result.length === 0) {
            return reply.status(400).send({ error: 'Credenciais inválidas' });
        }
        const user = result[0];
        const doesPasswordsMatch = await (0, argon2_1.verify)(user.password, password);
        if (!doesPasswordsMatch) {
            return reply.status(400).send({ error: 'Credenciais inválidas' });
        }
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET must be set.');
        }
        const token = jsonwebtoken_1.default.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET);
        return reply.status(200).send({ token });
    });
};
exports.loginRouter = loginRouter;

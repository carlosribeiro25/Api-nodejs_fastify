"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourseRoutePut = void 0;
const cliente_ts_1 = require("../database/cliente.ts");
const schema_ts_1 = require("../database/schema.ts");
const zod_1 = __importDefault(require("zod"));
const drizzle_orm_1 = require("drizzle-orm");
const check_req_jwt_ts_1 = require("./hooks/check-req-jwt.ts");
const check_user_role_ts_1 = require("./hooks/check-user-role.ts");
const updateCourseRoutePut = async (server) => {
    server.put('/courses/:id', {
        preHandler: [
            check_req_jwt_ts_1.checkRequestJwt,
            (0, check_user_role_ts_1.checkUserRole)('manager'),
        ],
        schema: {
            tags: ['Courses'],
            params: zod_1.default.object({
                id: zod_1.default.uuid()
            }),
            body: zod_1.default.object({
                title: zod_1.default.string().min(5, 'Título deve ter no mínimo 5 caracteres!'),
                description: zod_1.default.string().min(10, 'Descrição ter no mínimo 10 caracteres!')
            })
        }
    }, async (request, reply) => {
        const { id } = request.params;
        const { title, description } = request.body;
        const result = await cliente_ts_1.db
            .update(schema_ts_1.courses)
            .set({ title, description })
            .where((0, drizzle_orm_1.eq)(schema_ts_1.courses.id, id))
            .returning();
        if (result.length === 0) {
            return reply.status(404).send({ error: 'Curso não encontrado' });
        }
        return reply.status(200).send({ message: 'Curso atualizado com sucesso', course: result[0] });
    });
};
exports.updateCourseRoutePut = updateCourseRoutePut;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourseRoutePatch = void 0;
const cliente_ts_1 = require("../database/cliente.ts");
const schema_ts_1 = require("../database/schema.ts");
const zod_1 = __importDefault(require("zod"));
const drizzle_orm_1 = require("drizzle-orm");
const check_req_jwt_ts_1 = require("./hooks/check-req-jwt.ts");
const check_user_role_ts_1 = require("./hooks/check-user-role.ts");
const updateCourseRoutePatch = async (server) => {
    server.patch('/courses/:id', {
        preHandler: [
            check_req_jwt_ts_1.checkRequestJwt,
            (0, check_user_role_ts_1.checkUserRole)('manager'),
        ],
        schema: {
            tags: ['Courses'],
            params: zod_1.default.object({
                id: zod_1.default.uuid()
            }),
            additionalProperties: true,
            body: zod_1.default.object({
                title: zod_1.default.string().min(5, 'O titulo deve ter no minimo 5 caracteres!').optional(),
                description: zod_1.default.string().min(10, 'O titulo deve ter no minimo 5 caracteres!').optional()
            })
        }
    }, async (request, reply) => {
        const { id } = request.params;
        const body = request.body;
        const updated = await cliente_ts_1.db
            .update(schema_ts_1.courses)
            .set(body)
            .where((0, drizzle_orm_1.eq)(schema_ts_1.courses.id, id))
            .returning();
        if (!updated.length) {
            return reply.status(404).send({ error: 'Curso não encontrado' });
        }
        return reply.status(200).send({ message: 'Curso atualizado com sucesso', courses: updated[0] });
    });
};
exports.updateCourseRoutePatch = updateCourseRoutePatch;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseByIDRoute = void 0;
const cliente_ts_1 = require("../database/cliente.ts");
const schema_ts_1 = require("../database/schema.ts");
const zod_1 = __importDefault(require("zod"));
const drizzle_orm_1 = require("drizzle-orm");
const check_req_jwt_ts_1 = require("./hooks/check-req-jwt.ts");
const get_authenticated_use_ts_1 = require("./utils/get-authenticated-use.ts");
const getCourseByIDRoute = async (server) => {
    server.get('/courses/:id', {
        preHandler: [
            check_req_jwt_ts_1.checkRequestJwt,
        ],
        schema: {
            tags: ['Courses'],
            params: zod_1.default.object({
                id: zod_1.default.uuid()
            }),
            response: {
                200: zod_1.default.object({
                    course: zod_1.default.object({
                        id: zod_1.default.uuid(),
                        title: zod_1.default.string(),
                        description: zod_1.default.string().nullable(),
                    })
                }),
                404: zod_1.default.object({ error: zod_1.default.string() }).describe('Curso nao esncontrado.')
            },
        },
    }, async (request, reply) => {
        const user = (0, get_authenticated_use_ts_1.getAuthenticatedUser)(request);
        const courseId = request.params.id;
        const result = await cliente_ts_1.db
            .select().
            from(schema_ts_1.courses)
            .where((0, drizzle_orm_1.eq)(schema_ts_1.courses.id, courseId));
        if (result.length > 0) {
            return { course: result[0] };
        }
        return reply.status(404).send({ error: 'Curso não encontrado' });
    });
};
exports.getCourseByIDRoute = getCourseByIDRoute;

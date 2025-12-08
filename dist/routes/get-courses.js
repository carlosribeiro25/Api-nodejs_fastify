"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseRoute = void 0;
const cliente_ts_1 = require("../database/cliente.ts");
const schema_ts_1 = require("../database/schema.ts");
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = __importDefault(require("zod"));
const check_req_jwt_ts_1 = require("./hooks/check-req-jwt.ts");
const check_user_role_ts_1 = require("./hooks/check-user-role.ts");
const getCourseRoute = async (server) => {
    server.get('/courses', {
        preHandler: [
            check_req_jwt_ts_1.checkRequestJwt,
            (0, check_user_role_ts_1.checkUserRole)('manager')
        ],
        schema: {
            tags: ['Courses'],
            summary: 'Essa rota lista todos os cursos.',
            querystring: zod_1.default.object({
                search: zod_1.default.string().optional(),
                orderBy: zod_1.default.enum(['id', 'title']).optional().default('id'),
                page: zod_1.default.coerce.number().optional().default(1)
            }),
            response: {
                200: zod_1.default.object({
                    courses: zod_1.default.array(zod_1.default.object({
                        id: zod_1.default.uuid(),
                        title: zod_1.default.string(),
                        description: zod_1.default.string().nullable(),
                        enrollments: zod_1.default.number()
                    })),
                    total: zod_1.default.number(),
                })
            }
        }
    }, async (request, reply) => {
        const { search, orderBy, page } = request.query;
        const conditions = [];
        if (search) {
            conditions.push((0, drizzle_orm_1.ilike)(schema_ts_1.courses.title, `%${search}%`));
        }
        const [result, total] = await Promise.all([
            cliente_ts_1.db
                .select({
                id: schema_ts_1.courses.id,
                title: schema_ts_1.courses.title,
                description: schema_ts_1.courses.description,
                enrollments: (0, drizzle_orm_1.count)(schema_ts_1.enrollments.id)
            })
                .from(schema_ts_1.courses)
                .leftJoin(schema_ts_1.enrollments, (0, drizzle_orm_1.eq)(schema_ts_1.enrollments.courseId, schema_ts_1.courses.id))
                .orderBy((0, drizzle_orm_1.asc)(schema_ts_1.courses[orderBy]))
                .offset((page - 1) * 2)
                .limit(3)
                .where((0, drizzle_orm_1.and)(...conditions))
                .groupBy(schema_ts_1.courses.id),
            cliente_ts_1.db.$count(schema_ts_1.courses, (0, drizzle_orm_1.and)(...conditions))
        ]);
        return reply.send({ courses: result, total });
    });
};
exports.getCourseRoute = getCourseRoute;

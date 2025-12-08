"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourseRoute = void 0;
const cliente_ts_1 = require("../database/cliente.ts");
const schema_ts_1 = require("../database/schema.ts");
const zod_1 = __importDefault(require("zod"));
const check_req_jwt_ts_1 = require("./hooks/check-req-jwt.ts");
const check_user_role_ts_1 = require("./hooks/check-user-role.ts");
const createCourseRoute = async (server) => {
    server.post('/courses', {
        preHandler: [
            check_req_jwt_ts_1.checkRequestJwt,
            (0, check_user_role_ts_1.checkUserRole)('manager'),
        ],
        schema: {
            tags: ['Courses'],
            description: 'Nessa rota o titulo e  a descrição são obrigatórios',
            body: zod_1.default.object({
                title: zod_1.default.string().min(5, 'Título deve ter no mínimo 5 caracteres!'),
                description: zod_1.default.string().min(8, 'Descrição ter no mínimo 10 caracteres!')
            }),
            response: {
                201: zod_1.default.object({ courseId: zod_1.default.uuid() }).describe('Curso criado com sucesso!'),
                400: zod_1.default.object({ error: zod_1.default.string() })
            }
        },
    }, async (request, reply) => {
        const courseTitle = request.body.title;
        const courseDescription = request.body.description;
        try {
            const result = await cliente_ts_1.db
                .insert(schema_ts_1.courses)
                .values({ title: courseTitle, description: courseDescription })
                .returning();
            return reply.status(201).send({ courseId: result[0].id });
        }
        catch (error) {
            return reply.status(400).send({ error: 'Falha ao criar o curso' });
        }
    });
};
exports.createCourseRoute = createCourseRoute;

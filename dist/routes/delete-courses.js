"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourseRoute = void 0;
const cliente_ts_1 = require("../database/cliente.ts");
const schema_ts_1 = require("../database/schema.ts");
const zod_1 = __importDefault(require("zod"));
const drizzle_orm_1 = require("drizzle-orm");
const check_req_jwt_ts_1 = require("./hooks/check-req-jwt.ts");
const check_user_role_ts_1 = require("./hooks/check-user-role.ts");
const deleteCourseRoute = async (server) => {
    server.delete('/courses/:id', {
        preHandler: [
            check_req_jwt_ts_1.checkRequestJwt,
            (0, check_user_role_ts_1.checkUserRole)('manager'),
        ],
        schema: {
            tags: ['Courses'],
            params: zod_1.default.object({
                id: zod_1.default.uuid()
            }),
            response: {
                200: zod_1.default.string(),
                404: zod_1.default.string()
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        const result = await cliente_ts_1.db.delete(schema_ts_1.courses)
            .where((0, drizzle_orm_1.eq)(schema_ts_1.courses.id, id))
            .returning();
        if (result.length > 0) {
            reply.status(200).send("Curso deletado com sucesso");
        }
        else {
            reply.status(404).send("Curso nao encontrado!");
        }
    });
};
exports.deleteCourseRoute = deleteCourseRoute;

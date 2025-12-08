"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const fastify_1 = __importDefault(require("fastify"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const swagger_1 = require("@fastify/swagger");
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const create_courses_ts_1 = require("./routes/create-courses.ts");
const get_courses_ts_1 = require("./routes/get-courses.ts");
const get_coursesById_ts_1 = require("./routes/get-coursesById.ts");
const patch_courses_ts_1 = require("./routes/patch-courses.ts");
const put_courses_ts_1 = require("./routes/put-courses.ts");
const delete_courses_ts_1 = require("./routes/delete-courses.ts");
const login_ts_1 = require("./routes/login.ts");
const server = (0, fastify_1.default)({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },
}).withTypeProvider();
exports.server = server;
server.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
server.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
if (process.env.NODE_ENV === 'development') {
    server.register(swagger_1.fastifySwagger, {
        openapi: {
            info: {
                title: 'API com Node js',
                version: '1.0.0',
            }
        },
        transform: fastify_type_provider_zod_1.jsonSchemaTransform,
    });
    server.register(swagger_ui_1.default, {
        routePrefix: '/docs',
    });
}
server.register(create_courses_ts_1.createCourseRoute);
server.register(get_courses_ts_1.getCourseRoute);
server.register(get_coursesById_ts_1.getCourseByIDRoute);
server.register(patch_courses_ts_1.updateCourseRoutePatch);
server.register(put_courses_ts_1.updateCourseRoutePut);
server.register(delete_courses_ts_1.deleteCourseRoute);
server.register(login_ts_1.loginRouter);

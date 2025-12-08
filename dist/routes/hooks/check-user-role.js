"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserRole = checkUserRole;
const get_authenticated_use_ts_1 = require("../utils/get-authenticated-use.ts");
function checkUserRole(role) {
    return async function (request, reply) {
        const user = (0, get_authenticated_use_ts_1.getAuthenticatedUser)(request);
        if (user.role !== role) {
            return reply.status(401).send('Falha na atenticação');
        }
    };
}

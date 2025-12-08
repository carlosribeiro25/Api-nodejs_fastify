"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRequestJwt = checkRequestJwt;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function checkRequestJwt(request, reply) {
    const token = request.headers.authorization;
    if (!token) {
        return reply.status(401).send('Falha na atenticação');
    }
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET must be set.');
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        request.user = payload;
    }
    catch {
        return reply.status(401).send('Falha na atenticação');
    }
}

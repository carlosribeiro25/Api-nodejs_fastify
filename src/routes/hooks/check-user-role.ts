import type { FastifyRequest, FastifyReply } from 'fastify';
import { getAuthenticatedUser } from '../utils/get-authenticated-use.ts';

export function checkUserRole(role: 'student' | 'manager') {
    return async function (request: FastifyRequest, reply: FastifyReply) {
        const user = getAuthenticatedUser(request)

        if (user.role !== role) {
            return reply.status(401).send('Falha na atenticação');
        }
    }
}
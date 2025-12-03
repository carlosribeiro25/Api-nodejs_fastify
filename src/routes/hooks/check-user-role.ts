import type { FastifyRequest, FastifyReply } from 'fastify';
import { getAuthenticatedUser } from '../utils/get-authenticated-use.ts';

export  async function checkUserRole(request: FastifyRequest, reply: FastifyReply) {
    const user = getAuthenticatedUser(request)

    if(user.role !== 'manager') {
        return reply.status(401).send('Falha na atenticação');
    }

}
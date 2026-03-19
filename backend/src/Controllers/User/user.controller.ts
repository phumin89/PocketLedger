import { CurrentUserQuery, type CurrentUserResponse } from '@pocketledger/contracts';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { requestDispatcher } from '../../CQRS/RequestDispatcher.js';

export class UserController {
    async getCurrentUser(_request: FastifyRequest, reply: FastifyReply) {
        const user: CurrentUserResponse | null = await requestDispatcher.executeQuery(
            new CurrentUserQuery()
        );

        if (!user) {
            return reply.code(404).send({
                message: 'No user found.',
            });
        }

        return reply.send(user);
    }

    async updateCurrentUser(_request: FastifyRequest, reply: FastifyReply) {
        return reply.code(501).send({
            message: 'UserController.updateCurrentUser is not implemented yet.',
        });
    }
}

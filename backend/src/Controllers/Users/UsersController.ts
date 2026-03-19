import { CurrentUserQuery, type ICurrentUserResponse } from '@pocketledger/contracts';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IRequestDispatcher } from '../../CQRS/Contracts/IRequestDispatcher.ts';
import type { IUsersControllerDependencies } from './Contracts/IUsersControllerDependencies.ts';

export class UsersController {
    private readonly requestDispatcher: IRequestDispatcher;

    public constructor({ requestDispatcher }: IUsersControllerDependencies) {
        this.requestDispatcher = requestDispatcher;
    }

    public async getCurrentUser(
        _request: FastifyRequest,
        reply: FastifyReply
    ): Promise<FastifyReply> {
        const user: ICurrentUserResponse | null = await this.requestDispatcher.executeQuery(
            new CurrentUserQuery()
        );

        if (!user) {
            return reply.code(404).send({
                message: 'No user found.',
            });
        }

        return reply.send(user);
    }

    public async updateCurrentUser(
        _request: FastifyRequest,
        reply: FastifyReply
    ): Promise<FastifyReply> {
        return reply.code(501).send({
            message: 'UsersController.updateCurrentUser is not implemented yet.',
        });
    }
}

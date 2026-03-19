import { CurrentUserQuery, type ICurrentUserResponse } from '@pocketledger/contracts';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IRequestDispatcher } from '../../CQRS/Contracts/IRequestDispatcher.ts';
import { ControllerBase } from '../ControllerBase.ts';
import type { IUsersControllerDependencies } from './Contracts/IUsersControllerDependencies.ts';

export class UsersController extends ControllerBase {
    private readonly requestDispatcher: IRequestDispatcher;

    public constructor({ requestDispatcher }: IUsersControllerDependencies) {
        super();
        this.requestDispatcher = requestDispatcher;
    }

    public async currentUser(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        if (!request.authenticatedUserId) {
            return this.ServerError(reply, 'Authenticated user context is missing.');
        }

        const user: ICurrentUserResponse | null = await this.requestDispatcher.executeQuery(
            new CurrentUserQuery(request.authenticatedUserId)
        );

        if (!user) {
            return this.NotFound(reply, 'No user found.');
        }

        return this.Ok(reply, user);
    }

    public async updateCurrentUser(
        _request: FastifyRequest,
        reply: FastifyReply
    ): Promise<FastifyReply> {
        return this.NotImplemented(
            reply,
            'UsersController.updateCurrentUser is not implemented yet.'
        );
    }
}

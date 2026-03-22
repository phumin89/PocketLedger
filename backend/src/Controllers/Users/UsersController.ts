import { CurrentUserQuery, type ICurrentUserResponse } from '@pocketledger/contracts';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { RequestControllerBase } from '../RequestControllerBase.ts';
import type { IUsersControllerDependencies } from './Contracts/IUsersControllerDependencies.ts';

export class UsersController extends RequestControllerBase {
    public constructor({ requestDispatcher }: IUsersControllerDependencies) {
        super(requestDispatcher);
    }

    public async currentUser(_request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const user: ICurrentUserResponse | null = await this.ExecuteQuery(new CurrentUserQuery());

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

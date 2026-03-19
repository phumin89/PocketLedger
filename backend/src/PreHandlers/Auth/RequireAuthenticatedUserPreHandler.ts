import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IAuthCookieService } from '../../Services/Auth/Contracts/IAuthCookieService.ts';
import type { IAuthSessionService } from '../../Services/Auth/Contracts/IAuthSessionService.ts';
import type { IRequireAuthenticatedUserPreHandlerDependencies } from './Contracts/IRequireAuthenticatedUserPreHandlerDependencies.ts';

export class RequireAuthenticatedUserPreHandler {
    private readonly authCookieService: IAuthCookieService;
    private readonly authSessionService: IAuthSessionService;

    public constructor({
        authCookieService,
        authSessionService,
    }: IRequireAuthenticatedUserPreHandlerDependencies) {
        this.authCookieService = authCookieService;
        this.authSessionService = authSessionService;
    }

    public readonly handle = async (
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<void | FastifyReply> => {
        const sessionToken = this.authCookieService.getSessionToken(request.headers.cookie);

        if (!sessionToken) {
            return reply.code(401).send({
                message: 'Authentication required.',
            });
        }

        const userId = await this.authSessionService.getUserId(sessionToken);

        if (!userId) {
            return reply.code(401).send({
                message: 'Authentication required.',
            });
        }

        request.authenticatedUserId = userId;
    };
}

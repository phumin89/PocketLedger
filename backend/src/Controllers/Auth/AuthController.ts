import { LoginCommand, type ILoginRequest } from '@pocketledger/contracts';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IAuthCookieService } from '../../Services/Auth/Contracts/IAuthCookieService.ts';
import type { IAuthSessionService } from '../../Services/Auth/Contracts/IAuthSessionService.ts';
import { RequestControllerBase } from '../RequestControllerBase.ts';
import type { IAuthControllerDependencies } from './Contracts/IAuthControllerDependencies.ts';

export class AuthController extends RequestControllerBase {
    private readonly authCookieService: IAuthCookieService;
    private readonly authSessionService: IAuthSessionService;

    public constructor({
        authCookieService,
        authSessionService,
        requestDispatcher,
    }: IAuthControllerDependencies) {
        super(requestDispatcher);
        this.authCookieService = authCookieService;
        this.authSessionService = authSessionService;
    }

    public async login(
        request: FastifyRequest<{ Body: ILoginRequest }>,
        reply: FastifyReply
    ): Promise<FastifyReply> {
        const loginRequest = request.body;
        const loginResponse = await this.ExecuteCommand(new LoginCommand(loginRequest));

        if (!loginResponse) {
            return this.Unauthorized(reply, 'Invalid username or password.');
        }

        const sessionToken = await this.authSessionService.createSession(loginResponse.user.id);

        reply.header('Set-Cookie', this.authCookieService.createSessionCookieHeader(sessionToken));

        return this.Ok(reply, loginResponse);
    }
}

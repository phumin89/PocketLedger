import { LoginCommand, type ILoginRequest } from '@pocketledger/contracts';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import type { IRequestDispatcher } from '../../CQRS/Contracts/IRequestDispatcher.ts';
import type { IAuthCookieService } from '../../Services/Auth/Contracts/IAuthCookieService.ts';
import type { IAuthSessionService } from '../../Services/Auth/Contracts/IAuthSessionService.ts';
import { ControllerBase } from '../ControllerBase.ts';
import type { IAuthControllerDependencies } from './Contracts/IAuthControllerDependencies.ts';

export class AuthController extends ControllerBase {
    private readonly authCookieService: IAuthCookieService;
    private readonly authSessionService: IAuthSessionService;
    private readonly requestDispatcher: IRequestDispatcher;

    public constructor({
        authCookieService,
        authSessionService,
        requestDispatcher,
    }: IAuthControllerDependencies) {
        super();
        this.authCookieService = authCookieService;
        this.authSessionService = authSessionService;
        this.requestDispatcher = requestDispatcher;
    }

    public async login(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const loginRequest = this.parseLoginRequest(request.body);
        const loginResponse = await this.requestDispatcher.executeCommand(
            new LoginCommand(loginRequest)
        );

        if (!loginResponse) {
            return this.Unauthorized(reply, 'Invalid username or password.');
        }

        const sessionToken = await this.authSessionService.createSession(loginResponse.user.id);

        reply.header('Set-Cookie', this.authCookieService.createSessionCookieHeader(sessionToken));

        return this.Ok(reply, loginResponse);
    }

    private parseLoginRequest(body: unknown): ILoginRequest {
        const loginRequestSchema = z.object({
            username: z
                .string()
                .trim()
                .min(3)
                .max(64)
                .regex(/^[a-z0-9._-]+$/i),
            password: z.string().min(8).max(128),
        });

        return loginRequestSchema.parse(body) satisfies ILoginRequest;
    }
}

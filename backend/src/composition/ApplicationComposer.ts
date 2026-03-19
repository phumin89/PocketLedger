import { CurrentUserQueryHandler, LoginCommandHandler } from '@pocketledger/application';
import { CurrentUserQuery, LoginCommand } from '@pocketledger/contracts';
import { dbContext, type IDbContext } from '@pocketledger/database';
import { AuthController } from '../Controllers/Auth/AuthController.ts';
import { UsersController } from '../Controllers/Users/UsersController.ts';
import { RequestDispatcher } from '../CQRS/RequestDispatcher.ts';
import type { IHandlerRegistration } from '../CQRS/Types/HandlerRegistration.ts';
import { RequireAuthenticatedUserPreHandler } from '../PreHandlers/Auth/RequireAuthenticatedUserPreHandler.ts';
import { ApiRouteRegistrar } from '../routes/ApiRouteRegistrar.ts';
import { AuthRouteRegistrar } from '../routes/Auth/AuthRouteRegistrar.ts';
import { HealthRouteRegistrar } from '../routes/System/HealthRouteRegistrar.ts';
import { UsersRouteRegistrar } from '../routes/Users/UsersRouteRegistrar.ts';
import { AuthCookieService } from '../Services/Auth/AuthCookieService.ts';
import { AuthSessionService } from '../Services/Auth/AuthSessionService.ts';
import { PasswordHashingService } from '../Services/Auth/PasswordHashingService.ts';
import { SessionTokenService } from '../Services/Auth/SessionTokenService.ts';
import type { IApplicationDependencies } from './Contracts/IApplicationDependencies.ts';

export class ApplicationComposer {
    private readonly database: IDbContext;

    public constructor(database: IDbContext = dbContext) {
        this.database = database;
    }

    public compose(): IApplicationDependencies {
        const maxAgeSeconds = this.resolveSessionMaxAgeSeconds();
        const authCookieService = new AuthCookieService({
            cookieName: this.resolveSessionCookieName(),
            isSecure: process.env.NODE_ENV === 'production',
            maxAgeSeconds,
        });
        const sessionTokenService = new SessionTokenService();
        const authSessionService = new AuthSessionService({
            dbContext: this.database,
            maxAgeSeconds,
            sessionTokenService,
        });
        const passwordHashingService = new PasswordHashingService();
        const registrations: readonly IHandlerRegistration[] = [
            {
                requestType: CurrentUserQuery,
                handler: new CurrentUserQueryHandler({ dbContext: this.database }),
            },
            {
                requestType: LoginCommand,
                handler: new LoginCommandHandler({
                    dbContext: this.database,
                    passwordHashingService,
                }),
            },
        ];

        const requestDispatcher = new RequestDispatcher({
            registrations,
        });
        const authController = new AuthController({
            authCookieService,
            authSessionService,
            requestDispatcher,
        });
        const usersController = new UsersController({
            requestDispatcher,
        });
        const requireAuthenticatedUserPreHandler = new RequireAuthenticatedUserPreHandler({
            authCookieService,
            authSessionService,
        });
        const authRouteRegistrar = new AuthRouteRegistrar({
            authController,
        });
        const healthRouteRegistrar = new HealthRouteRegistrar({
            dbContext: this.database,
        });
        const usersRouteRegistrar = new UsersRouteRegistrar({
            requireAuthenticatedUserPreHandler,
            usersController,
        });
        const apiRouteRegistrar = new ApiRouteRegistrar({
            authRouteRegistrar,
            healthRouteRegistrar,
            usersRouteRegistrar,
        });

        return {
            apiRouteRegistrar,
            dbContext: this.database,
        };
    }

    private resolveSessionCookieName(): string {
        return process.env.AUTH_SESSION_COOKIE_NAME?.trim() || 'pocketledger_session';
    }

    private resolveSessionMaxAgeSeconds(): number {
        const parsedValue = Number(process.env.AUTH_SESSION_MAX_AGE_SECONDS ?? 604800);

        return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 604800;
    }
}

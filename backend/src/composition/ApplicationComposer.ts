import {
    CurrentUserQueryHandler,
    LoginCommandHandler,
    TransactionCreateCommandHandler,
    TransactionDeleteCommandHandler,
    TransactionDetailQueryHandler,
    TransactionUpdateCommandHandler,
    TransactionsListQueryHandler,
    type ICurrentUserContext,
} from '@pocketledger/application';
import {
    CurrentUserQuery,
    LoginCommand,
    TransactionCreateCommand,
    TransactionDeleteCommand,
    TransactionDetailQuery,
    TransactionUpdateCommand,
    TransactionsListQuery,
} from '@pocketledger/contracts';
import { dbContext, type IDbContext } from '@pocketledger/database';
import { AuthController } from '../Controllers/Auth/AuthController.ts';
import { TransactionsController } from '../Controllers/Transactions/TransactionsController.ts';
import { UsersController } from '../Controllers/Users/UsersController.ts';
import { RequestDispatcher } from '../CQRS/RequestDispatcher.ts';
import type { IHandlerRegistration } from '../CQRS/Types/HandlerRegistration.ts';
import { RequireAuthenticatedUserPreHandler } from '../PreHandlers/Auth/RequireAuthenticatedUserPreHandler.ts';
import { ApiRouteRegistrar } from '../routes/ApiRouteRegistrar.ts';
import { AuthRouteRegistrar } from '../routes/Auth/AuthRouteRegistrar.ts';
import { HealthRouteRegistrar } from '../routes/System/HealthRouteRegistrar.ts';
import { TransactionsRouteRegistrar } from '../routes/Transactions/TransactionsRouteRegistrar.ts';
import { UsersRouteRegistrar } from '../routes/Users/UsersRouteRegistrar.ts';
import { AuthCookieService } from '../Services/Auth/AuthCookieService.ts';
import { AuthSessionService } from '../Services/Auth/AuthSessionService.ts';
import { CurrentUserContext } from '../Services/Auth/CurrentUserContext.ts';
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
        const currentUserContext: ICurrentUserContext = new CurrentUserContext();
        const passwordHashingService = new PasswordHashingService();
        const registrations: readonly IHandlerRegistration[] = [
            {
                requestType: CurrentUserQuery,
                handler: new CurrentUserQueryHandler({
                    currentUserContext,
                    dbContext: this.database,
                }),
            },
            {
                requestType: LoginCommand,
                handler: new LoginCommandHandler({
                    currentUserContext,
                    dbContext: this.database,
                    passwordHashingService,
                }),
            },
            {
                requestType: TransactionCreateCommand,
                handler: new TransactionCreateCommandHandler({
                    currentUserContext,
                    dbContext: this.database,
                }),
            },
            {
                requestType: TransactionUpdateCommand,
                handler: new TransactionUpdateCommandHandler({
                    currentUserContext,
                    dbContext: this.database,
                }),
            },
            {
                requestType: TransactionDeleteCommand,
                handler: new TransactionDeleteCommandHandler({
                    currentUserContext,
                    dbContext: this.database,
                }),
            },
            {
                requestType: TransactionsListQuery,
                handler: new TransactionsListQueryHandler({
                    currentUserContext,
                    dbContext: this.database,
                }),
            },
            {
                requestType: TransactionDetailQuery,
                handler: new TransactionDetailQueryHandler({
                    currentUserContext,
                    dbContext: this.database,
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
        const transactionsController = new TransactionsController({
            requestDispatcher,
        });
        const requireAuthenticatedUserPreHandler = new RequireAuthenticatedUserPreHandler({
            authCookieService,
            authSessionService,
            currentUserContext,
        });
        const authRouteRegistrar = new AuthRouteRegistrar({
            authController,
        });
        const healthRouteRegistrar = new HealthRouteRegistrar({
            dbContext: this.database,
        });
        const usersRouteRegistrar = new UsersRouteRegistrar({
            currentUserContext,
            requireAuthenticatedUserPreHandler,
            usersController,
        });
        const transactionsRouteRegistrar = new TransactionsRouteRegistrar({
            currentUserContext,
            requireAuthenticatedUserPreHandler,
            transactionsController,
        });
        const apiRouteRegistrar = new ApiRouteRegistrar({
            authRouteRegistrar,
            healthRouteRegistrar,
            transactionsRouteRegistrar,
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

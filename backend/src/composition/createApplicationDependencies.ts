import { CurrentUserQueryHandler } from '@pocketledger/application';
import { CurrentUserQuery } from '@pocketledger/contracts';
import { dbContext, type IDbContext } from '@pocketledger/database';
import { RequestDispatcher } from '../CQRS/RequestDispatcher.ts';
import type { IHandlerRegistration } from '../CQRS/Types/HandlerRegistration.ts';
import { UsersController } from '../Controllers/Users/UsersController.ts';
import type { IApplicationDependencies } from './IApplicationDependencies.ts';

export function createApplicationDependencies(
    database: IDbContext = dbContext
): IApplicationDependencies {
    const registrations: readonly IHandlerRegistration[] = [
        {
            requestType: CurrentUserQuery,
            handler: new CurrentUserQueryHandler({ dbContext: database }),
        },
    ];

    const requestDispatcher = new RequestDispatcher({
        registrations,
    });

    const usersController = new UsersController({ requestDispatcher });

    return {
        dbContext: database,
        requestDispatcher,
        usersController,
    };
}

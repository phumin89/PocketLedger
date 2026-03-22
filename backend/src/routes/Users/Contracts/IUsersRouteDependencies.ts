import type { ICurrentUserContext } from '@pocketledger/application';
import type { UsersController } from '../../../Controllers/Users/UsersController.ts';
import type { RequireAuthenticatedUserPreHandler } from '../../../PreHandlers/Auth/RequireAuthenticatedUserPreHandler.ts';

export interface IUsersRouteDependencies {
    readonly currentUserContext: ICurrentUserContext;
    readonly requireAuthenticatedUserPreHandler: RequireAuthenticatedUserPreHandler;
    readonly usersController: UsersController;
}

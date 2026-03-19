import type { UsersController } from '../../../Controllers/Users/UsersController.ts';
import type { RequireAuthenticatedUserPreHandler } from '../../../PreHandlers/Auth/RequireAuthenticatedUserPreHandler.ts';

export interface IUsersRouteDependencies {
    readonly requireAuthenticatedUserPreHandler: RequireAuthenticatedUserPreHandler;
    readonly usersController: UsersController;
}

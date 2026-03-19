import type { IDbContext } from '@pocketledger/database';
import type { UsersController } from '../Controllers/Users/UsersController.ts';

export interface IApiRouteDependencies {
    readonly dbContext: IDbContext;
    readonly usersController: UsersController;
}

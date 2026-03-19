import type { IDbContext } from '@pocketledger/database';
import type { UsersController } from '../Controllers/Users/UsersController.ts';
import type { IRequestDispatcher } from '../CQRS/Contracts/IRequestDispatcher.ts';

export interface IApplicationDependencies {
    readonly dbContext: IDbContext;
    readonly requestDispatcher: IRequestDispatcher;
    readonly usersController: UsersController;
}

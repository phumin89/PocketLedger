import type { UsersController } from '../../../Controllers/Users/UsersController.ts';

export interface IUsersRouteDependencies {
    readonly usersController: UsersController;
}

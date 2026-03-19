import type { IUsersService } from '../../services/users/Contracts/IUsersService';

export interface IUseCurrentUserDependencies {
    readonly usersService?: IUsersService;
}

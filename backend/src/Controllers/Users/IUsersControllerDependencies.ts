import type { IRequestDispatcher } from '../../CQRS/Contracts/IRequestDispatcher.ts';

export interface IUsersControllerDependencies {
    readonly requestDispatcher: IRequestDispatcher;
}

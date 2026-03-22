import type { IRequestDispatcher } from '../../CQRS/Contracts/IRequestDispatcher.ts';

export interface IRequestControllerDependencies {
    readonly requestDispatcher: IRequestDispatcher;
}

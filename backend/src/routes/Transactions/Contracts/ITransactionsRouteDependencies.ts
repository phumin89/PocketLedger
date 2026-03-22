import type { ICurrentUserContext } from '@pocketledger/application';
import type { TransactionsController } from '../../../Controllers/Transactions/TransactionsController.ts';
import type { RequireAuthenticatedUserPreHandler } from '../../../PreHandlers/Auth/RequireAuthenticatedUserPreHandler.ts';

export interface ITransactionsRouteDependencies {
    readonly currentUserContext: ICurrentUserContext;
    readonly requireAuthenticatedUserPreHandler: RequireAuthenticatedUserPreHandler;
    readonly transactionsController: TransactionsController;
}

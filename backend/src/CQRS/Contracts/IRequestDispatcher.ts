import type { Command, Query, RequestResult } from '@pocketledger/contracts';

export interface IRequestDispatcher {
    executeCommand<TCommand extends Command<unknown>>(
        command: TCommand
    ): Promise<RequestResult<TCommand>>;
    executeQuery<TQuery extends Query<unknown>>(query: TQuery): Promise<RequestResult<TQuery>>;
}

import type { Command, Query } from '@pocketledger/contracts';
import type { RequestResult } from '../Types/RequestResult.js';

export interface ICqrs {
    command<TCommand extends Command<unknown>>(request: TCommand): Promise<RequestResult<TCommand>>;
    commands<TCommand extends Command<unknown>>(
        request: TCommand
    ): Promise<RequestResult<TCommand>>;
    query<TQuery extends Query<unknown>>(request: TQuery): Promise<RequestResult<TQuery>>;
    queries<TQuery extends Query<unknown>>(request: TQuery): Promise<RequestResult<TQuery>>;
}

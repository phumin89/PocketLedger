import type { Command, Query, RequestResult } from '@pocketledger/contracts';
import type { IRequestDispatcher } from '../CQRS/Contracts/IRequestDispatcher.ts';
import { ControllerBase } from './ControllerBase.ts';

export abstract class RequestControllerBase extends ControllerBase {
    private readonly requestDispatcher: IRequestDispatcher;

    protected constructor(requestDispatcher: IRequestDispatcher) {
        super();
        this.requestDispatcher = requestDispatcher;
    }

    protected ExecuteCommand<TCommand extends Command<unknown>>(
        command: TCommand
    ): Promise<RequestResult<TCommand>> {
        return this.requestDispatcher.executeCommand(command);
    }

    protected ExecuteQuery<TQuery extends Query<unknown>>(
        query: TQuery
    ): Promise<RequestResult<TQuery>> {
        return this.requestDispatcher.executeQuery(query);
    }
}

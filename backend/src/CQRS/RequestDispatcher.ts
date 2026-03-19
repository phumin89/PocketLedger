import type { Command, Query, RequestConstructor, RequestResult } from '@pocketledger/contracts';
import type { IRequestDispatcher } from './Contracts/IRequestDispatcher.ts';
import type { IRequestDispatcherDependencies } from './IRequestDispatcherDependencies.ts';
import type { DispatchableRequest } from './Types/DispatchableRequest.ts';
import type { IHandlerRegistration } from './Types/HandlerRegistration.ts';
import type { UntypedHandler } from './Types/UntypedHandler.ts';

export class RequestDispatcher implements IRequestDispatcher {
    private readonly handlersByRequestType = new Map<RequestConstructor<object>, UntypedHandler>();

    public constructor({ registrations }: IRequestDispatcherDependencies) {
        this.registerHandlers(registrations);
    }

    public async executeCommand<TCommand extends Command<unknown>>(
        command: TCommand
    ): Promise<RequestResult<TCommand>> {
        return this.execute(command);
    }

    public async executeQuery<TQuery extends Query<unknown>>(
        query: TQuery
    ): Promise<RequestResult<TQuery>> {
        return this.execute(query);
    }

    private async execute<TRequest extends DispatchableRequest>(
        request: TRequest
    ): Promise<RequestResult<TRequest>> {
        const requestType = this.resolveRequestType(request);
        const handler = this.handlersByRequestType.get(requestType);

        if (!handler) {
            throw new Error(`No handler registered for '${requestType.name}'.`);
        }

        return handler.execute(request) as Promise<RequestResult<TRequest>>;
    }

    private registerHandlers(registrations: readonly IHandlerRegistration[]): void {
        for (const { requestType, handler } of registrations) {
            if (this.handlersByRequestType.has(requestType)) {
                throw new Error(`Duplicate handler registration for '${requestType.name}'.`);
            }

            this.handlersByRequestType.set(requestType, handler);
        }
    }

    private resolveRequestType<TRequest extends DispatchableRequest>(
        request: TRequest
    ): RequestConstructor<TRequest> {
        if (!request || typeof request !== 'object') {
            throw new Error('Dispatcher requests must be class instances.');
        }

        const requestType = request.constructor;

        if (typeof requestType !== 'function') {
            throw new Error('Dispatcher requests must provide a constructor.');
        }

        return requestType as RequestConstructor<TRequest>;
    }
}

import * as applicationHandlers from '@pocketledger/application';
import type { Command, Query, RequestConstructor, RequestResult } from '@pocketledger/contracts';
import type { IRequestDispatcher } from './Contracts/IRequestDispatcher.js';
import type { HandlerInstance } from './Types/HandlerInstance.js';
import type { RegisteredHandlerClass } from './Types/RegisteredHandlerClass.js';

export class RequestDispatcher implements IRequestDispatcher {
    private readonly handlers = new Map<RequestConstructor, HandlerInstance<unknown, unknown>>();

    constructor(availableHandlers: Record<string, unknown> = applicationHandlers) {
        this.registerHandlers(availableHandlers);
    }

    async executeCommand<TCommand extends Command<unknown>>(
        command: TCommand
    ): Promise<RequestResult<TCommand>> {
        return this.execute(command);
    }

    async executeQuery<TQuery extends Query<unknown>>(
        query: TQuery
    ): Promise<RequestResult<TQuery>> {
        return this.execute(query);
    }

    private async execute<TRequest extends Command<unknown> | Query<unknown>>(
        request: TRequest
    ): Promise<RequestResult<TRequest>> {
        const requestType = this.getRequestType(request);
        const handler = this.handlers.get(requestType);

        if (!handler) {
            throw new Error(`No handler registered for '${requestType.name}'.`);
        }

        return handler.execute(request) as Promise<RequestResult<TRequest>>;
    }

    private registerHandlers(availableHandlers: Record<string, unknown>) {
        for (const exportedValue of Object.values(availableHandlers)) {
            if (!this.isRegisteredHandlerClass(exportedValue)) {
                continue;
            }

            const requestType = exportedValue.handles;

            if (this.handlers.has(requestType)) {
                throw new Error(`Duplicate handler registration for '${requestType.name}'.`);
            }

            this.handlers.set(requestType, new exportedValue());
        }
    }

    private getRequestType<TRequest extends object>(
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

    private isRegisteredHandlerClass(value: unknown): value is RegisteredHandlerClass {
        if (typeof value !== 'function') {
            return false;
        }

        if (
            !('handles' in value) ||
            typeof (value as { handles?: unknown }).handles !== 'function'
        ) {
            return false;
        }

        return (
            typeof (value as { prototype?: { execute?: unknown } }).prototype?.execute ===
            'function'
        );
    }
}

export const requestDispatcher: IRequestDispatcher = new RequestDispatcher();

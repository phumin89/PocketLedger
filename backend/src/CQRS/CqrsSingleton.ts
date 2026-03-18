import * as applicationHandlers from '@pocketledger/application';
import type { Command, Query } from '@pocketledger/contracts';
import type { ICqrs } from './Contracts/ICqrs.js';
import type { HandlerConstructor } from './Types/HandlerConstructor.js';
import type { HandlerMap } from './Types/HandlerMap.js';
import type { RequestResult } from './Types/RequestResult.js';

export class CqrsSingleton implements ICqrs {
    private static instance: CqrsSingleton | null = null;

    private readonly commandHandlers: HandlerMap = new Map();
    private readonly queryHandlers: HandlerMap = new Map();

    private constructor() {
        this.loadHandlers();
    }

    static get shared() {
        if (!CqrsSingleton.instance) {
            CqrsSingleton.instance = new CqrsSingleton();
        }

        return CqrsSingleton.instance;
    }

    async command<TCommand extends Command<unknown>>(
        request: TCommand
    ): Promise<RequestResult<TCommand>> {
        return this.execute<TCommand, RequestResult<TCommand>>(
            this.commandHandlers,
            request,
            'command'
        );
    }

    async commands<TCommand extends Command<unknown>>(
        request: TCommand
    ): Promise<RequestResult<TCommand>> {
        return this.command(request);
    }

    async query<TQuery extends Query<unknown>>(request: TQuery): Promise<RequestResult<TQuery>> {
        return this.execute<TQuery, RequestResult<TQuery>>(this.queryHandlers, request, 'query');
    }

    async queries<TQuery extends Query<unknown>>(request: TQuery): Promise<RequestResult<TQuery>> {
        return this.query(request);
    }

    private async execute<TRequest, TResult>(
        handlers: HandlerMap,
        request: TRequest,
        requestKind: 'command' | 'query'
    ) {
        const requestName = this.getRequestName(request);
        const handler = handlers.get(requestName);

        if (!handler) {
            throw new Error(`No ${requestKind} handler found for '${requestName}'.`);
        }

        return handler.execute(request) as Promise<TResult>;
    }

    private loadHandlers() {
        for (const exportedValue of Object.values(applicationHandlers)) {
            if (typeof exportedValue !== 'function') {
                continue;
            }

            const HandlerCtor = exportedValue as HandlerConstructor;
            const handlerName = HandlerCtor.name;

            if (handlerName.endsWith('CommandHandler')) {
                this.commandHandlers.set(
                    this.getRequestNameForHandler(HandlerCtor),
                    new HandlerCtor()
                );
            }

            if (handlerName.endsWith('QueryHandler')) {
                this.queryHandlers.set(
                    this.getRequestNameForHandler(HandlerCtor),
                    new HandlerCtor()
                );
            }
        }
    }

    private getRequestName(request: unknown) {
        if (!request || typeof request !== 'object') {
            throw new Error('CQRS request must be a class instance.');
        }

        const ctor = (request as { constructor?: { name?: string } }).constructor;
        const requestName = ctor?.name;

        if (!requestName) {
            throw new Error('CQRS request is missing a constructor name.');
        }

        return requestName;
    }

    private getRequestNameFromHandler(handlerName: string) {
        return handlerName.replace(/Handler$/, '');
    }

    private getRequestNameForHandler(handler: HandlerConstructor) {
        return handler.requestName ?? this.getRequestNameFromHandler(handler.name);
    }
}

import type { RequestConstructor } from '@pocketledger/contracts';
import type { HandlerInstance } from './HandlerInstance.js';

export type RegisteredHandlerClass<TRequest extends object = object> = {
    new (): HandlerInstance<TRequest, unknown>;
    readonly handles: RequestConstructor<TRequest>;
    readonly name: string;
};

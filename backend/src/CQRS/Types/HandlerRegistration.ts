import type { RequestConstructor } from '@pocketledger/contracts';
import type { IHandlerInstance } from './HandlerInstance.ts';

export interface IHandlerRegistration<TRequest extends object = object, TResult = unknown> {
    readonly requestType: RequestConstructor<TRequest>;
    readonly handler: IHandlerInstance<TRequest, TResult>;
}

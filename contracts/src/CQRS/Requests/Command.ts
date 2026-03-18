import type { ICommandRequest } from '../Contracts/ICommandRequest.js';

export abstract class Command<TResult = unknown> implements ICommandRequest<TResult> {
    declare readonly __resultType: TResult;
}

import type { CommandRequest } from '../Contracts/ICommandRequest.js';

export abstract class Command<TResult = unknown> implements CommandRequest<TResult> {
    declare readonly __resultType: TResult;
}

import type { ICommandRequest, ICommandResponse } from '@pocketledger/contracts';
import { CQRS } from './CQRS.js';

export abstract class CommandHandler<
    TRequest extends ICommandRequest<TResponse>,
    TResponse extends ICommandResponse | null,
> extends CQRS<TRequest, TResponse> {}

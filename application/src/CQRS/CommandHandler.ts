import type { ICommandRequest, ICommandResponse } from '@pocketledger/contracts';
import { RequestHandler } from './RequestHandler.ts';

export abstract class CommandHandler<
    TRequest extends ICommandRequest<TResponse>,
    TResponse extends ICommandResponse | null,
> extends RequestHandler<TRequest, TResponse> {}

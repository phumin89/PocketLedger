import type { CommandRequest, CommandResponse } from '@pocketledger/contracts';
import { RequestHandler } from './RequestHandler.js';

export abstract class CommandHandler<
    TRequest extends CommandRequest<TResponse>,
    TResponse extends CommandResponse | null,
> extends RequestHandler<TRequest, TResponse> {}

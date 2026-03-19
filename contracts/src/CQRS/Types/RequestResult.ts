import type { Command } from '../Requests/Command.js';
import type { Query } from '../Requests/Query.js';

export type RequestResult<TRequest> =
    TRequest extends Command<infer TResult>
        ? TResult
        : TRequest extends Query<infer TResult>
          ? TResult
          : never;

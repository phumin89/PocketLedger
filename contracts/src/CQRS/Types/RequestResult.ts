import type { Command } from '../Requests/Command.ts';
import type { Query } from '../Requests/Query.ts';

export type RequestResult<TRequest> =
    TRequest extends Command<infer TResult>
        ? TResult
        : TRequest extends Query<infer TResult>
          ? TResult
          : never;

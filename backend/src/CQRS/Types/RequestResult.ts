import type { Command, Query } from '@pocketledger/contracts';

export type RequestResult<TRequest> =
    TRequest extends Command<infer TResult>
        ? TResult
        : TRequest extends Query<infer TResult>
          ? TResult
          : never;

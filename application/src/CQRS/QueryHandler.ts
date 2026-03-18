import type { IQueryRequest, IQueryResponse } from '@pocketledger/contracts';
import { CQRS } from './CQRS.js';

export abstract class QueryHandler<
    TRequest extends IQueryRequest<TResponse>,
    TResponse extends IQueryResponse | null,
> extends CQRS<TRequest, TResponse> {}

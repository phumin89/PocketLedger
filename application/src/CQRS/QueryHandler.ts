import type { QueryRequest, QueryResponse } from '@pocketledger/contracts';
import { RequestHandler } from './RequestHandler.js';

export abstract class QueryHandler<
    TRequest extends QueryRequest<TResponse>,
    TResponse extends QueryResponse | null,
> extends RequestHandler<TRequest, TResponse> {}

import type { IQueryRequest, IQueryResponse } from '@pocketledger/contracts';
import { RequestHandler } from './RequestHandler.ts';

export abstract class QueryHandler<
    TRequest extends IQueryRequest<TResponse>,
    TResponse extends IQueryResponse | null,
> extends RequestHandler<TRequest, TResponse> {}

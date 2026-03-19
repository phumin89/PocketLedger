import type { QueryRequest } from '../Contracts/IQueryRequest.js';

export abstract class Query<TResult = unknown> implements QueryRequest<TResult> {
    declare readonly __resultType: TResult;
}

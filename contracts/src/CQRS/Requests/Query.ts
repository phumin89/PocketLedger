import type { IQueryRequest } from '../Contracts/IQueryRequest.js';

export abstract class Query<TResult = unknown> implements IQueryRequest<TResult> {
    declare readonly __resultType: TResult;
}

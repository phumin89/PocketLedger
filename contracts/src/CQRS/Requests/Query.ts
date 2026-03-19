import type { IQueryRequest } from '../Contracts/IQueryRequest.ts';

export abstract class Query<TResult = unknown> implements IQueryRequest<TResult> {
    declare readonly __resultType: TResult;
}

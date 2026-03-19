export interface QueryRequest<TResult = unknown> {
    readonly __resultType?: TResult;
}

export interface IQueryRequest<TResult = unknown> extends QueryRequest<TResult> {}

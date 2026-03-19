export interface IQueryRequest<TResult = unknown> {
    readonly __resultType?: TResult;
}

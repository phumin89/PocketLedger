export interface ICommandRequest<TResult = unknown> {
    readonly __resultType?: TResult;
}

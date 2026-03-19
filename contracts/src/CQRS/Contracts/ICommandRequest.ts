export interface CommandRequest<TResult = unknown> {
    readonly __resultType?: TResult;
}

export interface ICommandRequest<TResult = unknown> extends CommandRequest<TResult> {}

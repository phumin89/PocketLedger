export interface IHandlerInstance<TRequest, TResult> {
    execute(request: TRequest): Promise<TResult>;
}

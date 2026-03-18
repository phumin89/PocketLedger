export type HandlerInstance<TRequest, TResult> = {
    execute(request: TRequest): Promise<TResult>;
};

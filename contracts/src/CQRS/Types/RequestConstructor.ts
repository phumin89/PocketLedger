export type RequestConstructor<TRequest extends object = object> = abstract new (
    ...args: unknown[]
) => TRequest;

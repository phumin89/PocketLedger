export interface IApiClient {
    requestJson<TResponse>(path: string, requestInit?: RequestInit): Promise<TResponse>;
}

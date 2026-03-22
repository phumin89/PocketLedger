import type { IApiClient } from '../../api/Contracts/IApiClient';

export interface ITransactionsServiceDependencies {
    readonly apiClient: IApiClient;
}

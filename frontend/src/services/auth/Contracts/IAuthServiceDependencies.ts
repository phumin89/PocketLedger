import type { IApiClient } from '../../api/Contracts/IApiClient';

export interface IAuthServiceDependencies {
    readonly apiClient: IApiClient;
}

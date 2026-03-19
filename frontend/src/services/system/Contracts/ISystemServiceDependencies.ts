import type { IApiClient } from '../../api/Contracts/IApiClient';

export interface ISystemServiceDependencies {
    readonly apiClient: IApiClient;
}

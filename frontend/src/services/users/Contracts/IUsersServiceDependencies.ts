import type { IApiClient } from '../../api/Contracts/IApiClient';

export interface IUsersServiceDependencies {
    readonly apiClient: IApiClient;
}

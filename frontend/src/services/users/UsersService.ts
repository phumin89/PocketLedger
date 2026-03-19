import type { ICurrentUserResponse } from '@pocketledger/contracts';
import type { IApiClient } from '../api/Contracts/IApiClient';
import type { IUsersService } from './Contracts/IUsersService';
import type { IUsersServiceDependencies } from './Contracts/IUsersServiceDependencies';

export class UsersService implements IUsersService {
    private readonly apiClient: IApiClient;

    public constructor({ apiClient }: IUsersServiceDependencies) {
        this.apiClient = apiClient;
    }

    public getCurrentUser(signal?: AbortSignal): Promise<ICurrentUserResponse> {
        return this.apiClient.requestJson<ICurrentUserResponse>('/api/users/current-user', {
            signal,
        });
    }
}

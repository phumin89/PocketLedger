import type { IApiClient } from '../api/Contracts/IApiClient';
import type { ApiHealth } from './ApiHealth';
import type { ISystemService } from './Contracts/ISystemService';
import type { ISystemServiceDependencies } from './Contracts/ISystemServiceDependencies';

export class SystemService implements ISystemService {
    private readonly apiClient: IApiClient;

    public constructor({ apiClient }: ISystemServiceDependencies) {
        this.apiClient = apiClient;
    }

    public getApiHealth(signal?: AbortSignal): Promise<ApiHealth> {
        return this.apiClient.requestJson<ApiHealth>('/api/health/status', { signal });
    }
}

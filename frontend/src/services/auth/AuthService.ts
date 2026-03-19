import type { ILoginRequest, ILoginResponse } from '@pocketledger/contracts';
import type { IApiClient } from '../api/Contracts/IApiClient';
import type { IAuthService } from './Contracts/IAuthService';
import type { IAuthServiceDependencies } from './Contracts/IAuthServiceDependencies';

export class AuthService implements IAuthService {
    private readonly apiClient: IApiClient;

    public constructor({ apiClient }: IAuthServiceDependencies) {
        this.apiClient = apiClient;
    }

    public login(loginRequest: ILoginRequest, signal?: AbortSignal): Promise<ILoginResponse> {
        return this.apiClient.requestJson<ILoginResponse>('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginRequest),
            signal,
        });
    }
}

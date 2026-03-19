import type { ILoginRequest, ILoginResponse } from '@pocketledger/contracts';

export interface IAuthService {
    login(loginRequest: ILoginRequest, signal?: AbortSignal): Promise<ILoginResponse>;
}

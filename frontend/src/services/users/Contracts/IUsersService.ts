import type { ICurrentUserResponse } from '@pocketledger/contracts';

export interface IUsersService {
    getCurrentUser(signal?: AbortSignal): Promise<ICurrentUserResponse>;
}

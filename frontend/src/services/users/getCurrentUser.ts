import type { ICurrentUserResponse } from '@pocketledger/contracts';
import { requestJson } from '../api/requestJson';

export function getCurrentUser(signal?: AbortSignal): Promise<ICurrentUserResponse> {
    return requestJson<ICurrentUserResponse>('/api/users/me', { signal });
}

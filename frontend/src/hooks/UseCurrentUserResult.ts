import type { ICurrentUserResponse } from '@pocketledger/contracts';

export type UseCurrentUserResult = {
    currentUser: ICurrentUserResponse | null;
    error: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    refreshCurrentUser(): Promise<void>;
};

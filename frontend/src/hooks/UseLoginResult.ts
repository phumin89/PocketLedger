import type { ILoginRequest, ILoginResponse } from '@pocketledger/contracts';

export type UseLoginResult = {
    error: string | null;
    isSubmitting: boolean;
    login(loginRequest: ILoginRequest): Promise<ILoginResponse | null>;
};

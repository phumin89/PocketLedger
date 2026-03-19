import type { ILoginRequest, ILoginResponse } from '@pocketledger/contracts';
import { useState } from 'react';
import { frontendServices } from '../composition/frontendServices';
import { ApiError } from '../services/api/ApiError';
import type { IUseLoginDependencies } from './Contracts/IUseLoginDependencies';
import type { UseLoginResult } from './UseLoginResult';

export function useLogin(dependencies: IUseLoginDependencies = {}): UseLoginResult {
    const authService = dependencies.authService ?? frontendServices.authService;
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function login(loginRequest: ILoginRequest): Promise<ILoginResponse | null> {
        setIsSubmitting(true);

        try {
            const loginResponse = await authService.login(loginRequest);
            setError(null);

            return loginResponse;
        } catch (loginError) {
            if (loginError instanceof ApiError && isInvalidLoginError(loginError)) {
                setError('Invalid username or password.');
                return null;
            }

            setError(
                loginError instanceof Error ? loginError.message : 'Pocket ledger login failed.'
            );

            return null;
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        error,
        isSubmitting,
        login,
    };
}

function isInvalidLoginError(loginError: ApiError): boolean {
    return loginError.statusCode === 400 || loginError.statusCode === 401;
}

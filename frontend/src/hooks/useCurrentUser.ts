import type { ICurrentUserResponse } from '@pocketledger/contracts';
import { useEffect, useState } from 'react';
import { frontendServices } from '../composition/frontendServices';
import { ApiError } from '../services/api/ApiError';
import type { IUseCurrentUserDependencies } from './Contracts/IUseCurrentUserDependencies';
import type { UseCurrentUserResult } from './UseCurrentUserResult';

export function useCurrentUser(
    dependencies: IUseCurrentUserDependencies = {}
): UseCurrentUserResult {
    const usersService = dependencies.usersService ?? frontendServices.usersService;
    const [currentUser, setCurrentUser] = useState<ICurrentUserResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();

        void loadCurrentUser(abortController.signal);

        return () => {
            abortController.abort();
        };
    }, [usersService]);

    async function refreshCurrentUser(): Promise<void> {
        await loadCurrentUser();
    }

    async function loadCurrentUser(signal?: AbortSignal): Promise<void> {
        setIsLoading(true);

        try {
            const user = await usersService.getCurrentUser(signal);
            setCurrentUser(user);
            setError(null);
        } catch (loadError) {
            if (loadError instanceof DOMException && loadError.name === 'AbortError') {
                return;
            }

            if (loadError instanceof ApiError && loadError.statusCode === 401) {
                setCurrentUser(null);
                setError(null);
                return;
            }

            if (loadError instanceof ApiError && loadError.statusCode === 404) {
                setError('No user record was found for the active session.');
                setCurrentUser(null);
                return;
            }

            setError(
                loadError instanceof Error
                    ? loadError.message
                    : 'Pocket ledger user service is not reachable.'
            );
            setCurrentUser(null);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        currentUser,
        error,
        isAuthenticated: currentUser !== null,
        isLoading,
        refreshCurrentUser,
    };
}

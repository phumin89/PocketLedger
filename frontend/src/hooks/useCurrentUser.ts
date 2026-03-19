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
        let isActive = true;

        async function loadCurrentUser() {
            try {
                const user = await usersService.getCurrentUser(abortController.signal);
                if (!isActive) {
                    return;
                }

                setCurrentUser(user);
                setError(null);
            } catch (loadError) {
                if (loadError instanceof DOMException && loadError.name === 'AbortError') {
                    return;
                }

                if (!isActive) {
                    return;
                }

                if (loadError instanceof ApiError && loadError.statusCode === 404) {
                    setError('No user record was found yet. Showing fallback overview data.');
                    setCurrentUser(null);
                    return;
                }

                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : 'PocketLedger user service is not reachable.'
                );
                setCurrentUser(null);
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        void loadCurrentUser();

        return () => {
            isActive = false;
            abortController.abort();
        };
    }, [usersService]);

    return {
        currentUser,
        error,
        isLoading,
    };
}

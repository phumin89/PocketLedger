import type { ICurrentUserResponse } from '@pocketledger/contracts';
import { useEffect, useState } from 'react';
import { ApiError } from '../services/api/ApiError';
import { getCurrentUser } from '../services/users/getCurrentUser';
import type { UseCurrentUserResult } from './UseCurrentUserResult';

export function useCurrentUser(): UseCurrentUserResult {
    const [currentUser, setCurrentUser] = useState<ICurrentUserResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();
        let isActive = true;

        async function loadCurrentUser() {
            try {
                const user = await getCurrentUser(abortController.signal);
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
    }, []);

    return {
        currentUser,
        error,
        isLoading,
    };
}

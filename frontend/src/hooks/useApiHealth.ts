import { useEffect, useState } from 'react';
import type { ApiHealth } from '../services/system/ApiHealth';
import { getApiHealth } from '../services/system/getApiHealth';
import type { UseApiHealthResult } from './UseApiHealthResult';

export function useApiHealth(): UseApiHealthResult {
    const [apiHealth, setApiHealth] = useState<ApiHealth | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const abortController = new AbortController();
        let isActive = true;

        async function loadHealth() {
            try {
                const health = await getApiHealth(abortController.signal);
                if (!isActive) {
                    return;
                }

                setApiHealth(health);
                setError(null);
            } catch (loadError) {
                if (loadError instanceof DOMException && loadError.name === 'AbortError') {
                    return;
                }

                if (!isActive) {
                    return;
                }

                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : 'PocketLedger API is not reachable.'
                );
            }
        }

        void loadHealth();

        return () => {
            isActive = false;
            abortController.abort();
        };
    }, []);

    return {
        apiHealth,
        error,
    };
}

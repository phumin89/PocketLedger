import { useEffect, useState } from 'react';
import type { ApiHealth } from '../lib/ApiHealth.ts';
import { fetchApiHealth } from '../lib/api';
import type { UseApiHealthResult } from './UseApiHealthResult.ts';

export function useApiHealth(): UseApiHealthResult {
    const [apiHealth, setApiHealth] = useState<ApiHealth | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadHealth() {
            try {
                const health = await fetchApiHealth();
                setApiHealth(health);
                setError(null);
            } catch (loadError) {
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : 'PocketLedger API is not reachable.'
                );
            }
        }

        void loadHealth();
    }, []);

    return {
        apiHealth,
        error,
    };
}

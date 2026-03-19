import { useEffect, useState } from 'react';
import { frontendServices } from '../composition/frontendServices';
import type { ApiHealth } from '../services/system/ApiHealth';
import type { IUseApiHealthDependencies } from './Contracts/IUseApiHealthDependencies';
import type { UseApiHealthResult } from './UseApiHealthResult';

export function useApiHealth(dependencies: IUseApiHealthDependencies = {}): UseApiHealthResult {
    const systemService = dependencies.systemService ?? frontendServices.systemService;
    const [apiHealth, setApiHealth] = useState<ApiHealth | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const abortController = new AbortController();
        let isActive = true;

        async function loadHealth() {
            try {
                const health = await systemService.getApiHealth(abortController.signal);
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
                        : 'Pocket ledger API is not reachable.'
                );
            }
        }

        void loadHealth();

        return () => {
            isActive = false;
            abortController.abort();
        };
    }, [systemService]);

    return {
        apiHealth,
        error,
    };
}

import type { ApiHealth } from '../lib/ApiHealth.ts';

export type UseApiHealthResult = {
    apiHealth: ApiHealth | null;
    error: string | null;
};

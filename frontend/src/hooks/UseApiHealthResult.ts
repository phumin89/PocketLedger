import type { ApiHealth } from '../lib/ApiHealth';

export type UseApiHealthResult = {
    apiHealth: ApiHealth | null;
    error: string | null;
};

import type { ApiHealth } from '../services/system/ApiHealth';

export type UseApiHealthResult = {
    apiHealth: ApiHealth | null;
    error: string | null;
};

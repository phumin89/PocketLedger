import type { ApiHealth } from '../../lib/ApiHealth.ts';

export type StatusPanelProps = {
    apiHealth: ApiHealth | null;
    error: string | null;
};

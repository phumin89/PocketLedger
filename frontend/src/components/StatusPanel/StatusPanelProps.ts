import type { ApiHealth } from '../../lib/ApiHealth';

export type StatusPanelProps = {
    apiHealth: ApiHealth | null;
    error: string | null;
};

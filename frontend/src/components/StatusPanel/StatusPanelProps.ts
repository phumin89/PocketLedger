import type { ApiHealth } from '../../services/system/ApiHealth';

export type StatusPanelProps = {
    apiHealth: ApiHealth | null;
    error: string | null;
};

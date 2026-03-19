import type { ApiHealth } from '../ApiHealth';

export interface ISystemService {
    getApiHealth(signal?: AbortSignal): Promise<ApiHealth>;
}

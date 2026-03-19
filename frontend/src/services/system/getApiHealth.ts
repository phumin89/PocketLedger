import { requestJson } from '../api/requestJson';
import type { ApiHealth } from './ApiHealth';

export function getApiHealth(signal?: AbortSignal): Promise<ApiHealth> {
    return requestJson<ApiHealth>('/api/health', { signal });
}

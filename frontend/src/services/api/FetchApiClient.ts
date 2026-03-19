import { ApiError } from './ApiError';
import type { IApiClient } from './Contracts/IApiClient';

export class FetchApiClient implements IApiClient {
    public async requestJson<TResponse>(
        path: string,
        requestInit?: RequestInit
    ): Promise<TResponse> {
        const response = await fetch(this.buildApiUrl(path), {
            ...requestInit,
            credentials: requestInit?.credentials ?? 'include',
        });

        if (!response.ok) {
            throw await this.createApiError(response);
        }

        return (await response.json()) as TResponse;
    }

    private buildApiUrl(path: string): string {
        const apiBase = import.meta.env.VITE_API_BASE_URL?.trim();

        if (!apiBase) {
            return path;
        }

        const normalizedBase = apiBase.endsWith('/') ? apiBase : `${apiBase}/`;

        return new URL(path, normalizedBase).toString();
    }

    private async createApiError(failedResponse: Response): Promise<ApiError> {
        const fallbackMessage = `Pocket ledger API returned ${failedResponse.status}.`;
        const contentType = failedResponse.headers.get('content-type');

        if (contentType?.includes('application/json')) {
            const payload = (await failedResponse.json()) as { message?: unknown };

            if (typeof payload.message === 'string' && payload.message.trim().length > 0) {
                return new ApiError(payload.message, failedResponse.status);
            }

            return new ApiError(fallbackMessage, failedResponse.status);
        }

        const responseText = await failedResponse.text();
        const message = responseText.trim().length > 0 ? responseText.trim() : fallbackMessage;

        return new ApiError(message, failedResponse.status);
    }
}

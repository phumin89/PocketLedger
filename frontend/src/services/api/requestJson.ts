import { ApiError } from './ApiError';
import { buildApiUrl } from './buildApiUrl';

export async function requestJson<TResponse>(
    path: string,
    requestInit?: RequestInit
): Promise<TResponse> {
    const response = await fetch(buildApiUrl(path), requestInit);

    if (!response.ok) {
        throw await createApiError(response);
    }

    return (await response.json()) as TResponse;

    async function createApiError(failedResponse: Response): Promise<ApiError> {
        const fallbackMessage = `PocketLedger API returned ${failedResponse.status}.`;
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

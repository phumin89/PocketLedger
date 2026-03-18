export type ApiHealth = {
    status: string;
    service: string;
    database: string;
    timestamp: string;
};

export async function fetchApiHealth(): Promise<ApiHealth> {
    const apiBase = import.meta.env.VITE_API_BASE_URL ?? '';
    const response = await fetch(`${apiBase}/api/health`);

    if (!response.ok) {
        throw new Error('PocketLedger API returned an unexpected response.');
    }

    return (await response.json()) as ApiHealth;
}

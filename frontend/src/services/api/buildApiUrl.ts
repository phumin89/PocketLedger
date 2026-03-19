export function buildApiUrl(path: string): string {
    const apiBase = import.meta.env.VITE_API_BASE_URL?.trim();

    if (!apiBase) {
        return path;
    }

    const normalizedBase = apiBase.endsWith('/') ? apiBase : `${apiBase}/`;

    return new URL(path, normalizedBase).toString();
}

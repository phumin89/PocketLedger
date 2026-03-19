export class ApiError extends Error {
    public readonly statusCode: number;

    public constructor(message: string, statusCode: number) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
    }
}

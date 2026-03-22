export interface ICurrentUserContext {
    getCurrentUserId(): string | null;
    requireCurrentUserId(): string;
    runWithCurrentUserId<TResult>(currentUserId: string, callback: () => TResult): TResult;
    setCurrentUserId(currentUserId: string): void;
}

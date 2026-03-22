import type { ICurrentUserContext } from '@pocketledger/application';
import { AsyncLocalStorage } from 'node:async_hooks';

export class CurrentUserContext implements ICurrentUserContext {
    private readonly currentUserIdStorage = new AsyncLocalStorage<string>();

    public getCurrentUserId(): string | null {
        return this.currentUserIdStorage.getStore() ?? null;
    }

    public requireCurrentUserId(): string {
        const currentUserId = this.getCurrentUserId();

        if (!currentUserId) {
            throw new Error('Authenticated user context is missing.');
        }

        return currentUserId;
    }

    public runWithCurrentUserId<TResult>(currentUserId: string, callback: () => TResult): TResult {
        return this.currentUserIdStorage.run(currentUserId, callback);
    }

    public setCurrentUserId(currentUserId: string): void {
        this.currentUserIdStorage.enterWith(currentUserId);
    }
}

import type { IDbContext } from '@pocketledger/database';
import type { ISessionTokenService } from './ISessionTokenService.ts';

export interface IAuthSessionServiceDependencies {
    readonly dbContext: IDbContext;
    readonly maxAgeSeconds: number;
    readonly sessionTokenService: ISessionTokenService;
}

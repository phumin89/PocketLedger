import type { IPasswordHashingService } from '@pocketledger/application';
import type { IDbContext } from '@pocketledger/database';

export interface IDevelopmentUserProvisionerDependencies {
    readonly dbContext: IDbContext;
    readonly passwordHashingService: IPasswordHashingService;
}

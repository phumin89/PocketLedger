import type { IPasswordHashingService } from '@pocketledger/application';
import type { IDbContext } from '@pocketledger/database';
import type { IDevelopmentUserProvisionerDependencies } from './Contracts/IDevelopmentUserProvisionerDependencies.ts';
import type { IDevelopmentUserSeed } from './Contracts/IDevelopmentUserSeed.ts';

export class DevelopmentUserProvisioner {
    private readonly dbContext: IDbContext;
    private readonly passwordHashingService: IPasswordHashingService;

    public constructor({
        dbContext,
        passwordHashingService,
    }: IDevelopmentUserProvisionerDependencies) {
        this.dbContext = dbContext;
        this.passwordHashingService = passwordHashingService;
    }

    public async ensureUser(): Promise<void> {
        const developmentUserSeed = this.resolveDevelopmentUserSeed();

        if (!developmentUserSeed) {
            return;
        }

        const existingAuthIdentity = await this.dbContext.authIdentity.findUnique({
            where: {
                username: developmentUserSeed.username,
            },
            include: {
                user: true,
            },
        });

        if (existingAuthIdentity) {
            await this.updateDevelopmentIdentity(
                existingAuthIdentity.id,
                developmentUserSeed.password
            );
            return;
        }

        const existingUser = await this.dbContext.user.findUnique({
            where: {
                email: developmentUserSeed.email,
            },
        });

        if (existingUser) {
            await this.createAuthIdentity(existingUser.id, developmentUserSeed);
            return;
        }

        await this.createDevelopmentUser(developmentUserSeed);
    }

    private async createDevelopmentUser(developmentUserSeed: IDevelopmentUserSeed): Promise<void> {
        const passwordHash = await this.passwordHashingService.hashPassword(
            developmentUserSeed.password
        );

        await this.dbContext.user.create({
            data: {
                email: developmentUserSeed.email,
                firstName: developmentUserSeed.firstName,
                lastName: developmentUserSeed.lastName,
                authIdentities: {
                    create: {
                        username: developmentUserSeed.username,
                        passwordHash,
                    },
                },
            },
        });
    }

    private async createAuthIdentity(
        userId: string,
        developmentUserSeed: IDevelopmentUserSeed
    ): Promise<void> {
        const passwordHash = await this.passwordHashingService.hashPassword(
            developmentUserSeed.password
        );

        await this.dbContext.authIdentity.create({
            data: {
                userId,
                username: developmentUserSeed.username,
                passwordHash,
            },
        });
    }

    private async updateDevelopmentIdentity(
        authIdentityId: string,
        password: string
    ): Promise<void> {
        const passwordHash = await this.passwordHashingService.hashPassword(password);

        await this.dbContext.authIdentity.update({
            where: {
                id: authIdentityId,
            },
            data: {
                passwordHash,
            },
        });
    }

    private resolveDevelopmentUserSeed(): IDevelopmentUserSeed | null {
        if (!this.isDevelopmentUserProvisioningEnabled()) {
            return null;
        }

        const email = process.env.AUTH_DEV_USER_EMAIL?.trim();
        const password = process.env.AUTH_DEV_USER_PASSWORD?.trim();
        const username = process.env.AUTH_DEV_USERNAME?.trim();

        if (!email || !password || !username) {
            throw new Error(
                'Development user provisioning requires AUTH_DEV_USER_EMAIL, AUTH_DEV_USER_PASSWORD, and AUTH_DEV_USERNAME.'
            );
        }

        return {
            email: email.toLowerCase(),
            firstName: process.env.AUTH_DEV_USER_FIRST_NAME?.trim() || 'Pocket',
            lastName: process.env.AUTH_DEV_USER_LAST_NAME?.trim() || 'Ledger',
            password,
            username: username.toLowerCase(),
        };
    }

    private isDevelopmentUserProvisioningEnabled(): boolean {
        return process.env.AUTH_DEV_USER_ENABLED?.trim().toLowerCase() === 'true';
    }
}

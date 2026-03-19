import type { IDbContext } from '@pocketledger/database';
import type { IAuthSessionService } from './Contracts/IAuthSessionService.ts';
import type { IAuthSessionServiceDependencies } from './Contracts/IAuthSessionServiceDependencies.ts';
import type { ISessionTokenService } from './Contracts/ISessionTokenService.ts';

export class AuthSessionService implements IAuthSessionService {
    private readonly dbContext: IDbContext;
    private readonly maxAgeSeconds: number;
    private readonly sessionTokenService: ISessionTokenService;

    public constructor({
        dbContext,
        maxAgeSeconds,
        sessionTokenService,
    }: IAuthSessionServiceDependencies) {
        this.dbContext = dbContext;
        this.maxAgeSeconds = maxAgeSeconds;
        this.sessionTokenService = sessionTokenService;
    }

    public async createSession(userId: string): Promise<string> {
        const sessionToken = this.sessionTokenService.createToken();
        const sessionTokenHash = this.sessionTokenService.hashToken(sessionToken);

        await this.dbContext.authSession.create({
            data: {
                userId,
                sessionTokenHash,
                expiresAt: new Date(Date.now() + this.maxAgeSeconds * 1000),
            },
        });

        return sessionToken;
    }

    public async getUserId(sessionToken: string): Promise<string | null> {
        const sessionTokenHash = this.sessionTokenService.hashToken(sessionToken);
        const activeSession = await this.dbContext.authSession.findFirst({
            where: {
                sessionTokenHash,
                revokedAt: null,
                expiresAt: {
                    gt: new Date(),
                },
            },
            select: {
                userId: true,
            },
        });

        return activeSession?.userId ?? null;
    }
}

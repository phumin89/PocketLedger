import type { ICurrentUserResponse, ILoginResponse } from '@pocketledger/contracts';
import { LoginCommand } from '@pocketledger/contracts';
import type { DatabaseUserModel } from '@pocketledger/database';
import type { IPasswordHashingService } from '../../../Auth/Contracts/IPasswordHashingService.ts';
import { CommandHandler } from '../../../CQRS/CommandHandler.ts';
import type { ILoginCommandHandlerDependencies } from './Contracts/ILoginCommandHandlerDependencies.ts';

export class LoginCommandHandler extends CommandHandler<LoginCommand, ILoginResponse | null> {
    private readonly passwordHashingService: IPasswordHashingService;

    public constructor({
        currentUserContext,
        dbContext,
        passwordHashingService,
    }: ILoginCommandHandlerDependencies) {
        super({ currentUserContext, dbContext });
        this.passwordHashingService = passwordHashingService;
    }

    public override async execute(command: LoginCommand): Promise<ILoginResponse | null> {
        const authIdentity = await this.dbContext.authIdentity.findUnique({
            where: {
                username: command.username,
            },
            include: {
                user: true,
            },
        });

        if (!authIdentity) {
            return null;
        }

        const authenticatedUser = await this.resolveAuthenticatedUser(
            authIdentity,
            command.password
        );

        if (!authenticatedUser) {
            return null;
        }

        return {
            success: true,
            messages: [],
            user: this.mapUserToResponse(authenticatedUser),
        };
    }

    private async resolveAuthenticatedUser(
        authIdentity: { passwordHash: string; user: DatabaseUserModel },
        password: string
    ): Promise<DatabaseUserModel | null> {
        const isPasswordValid = await this.passwordHashingService.verifyPassword(
            password,
            authIdentity.passwordHash
        );

        return isPasswordValid ? authIdentity.user : null;
    }

    private mapUserToResponse(user: DatabaseUserModel): ICurrentUserResponse {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            locale: user.locale,
            timeZone: user.timeZone,
            currencyCode: user.currencyCode,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        };
    }
}

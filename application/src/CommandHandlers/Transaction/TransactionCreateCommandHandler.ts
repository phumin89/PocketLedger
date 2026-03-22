import { TransactionCreateCommand, type ITransactionCreateResponse } from '@pocketledger/contracts';
import { CommandHandler } from '../../CQRS/CommandHandler.ts';
import type { IRequestHandlerDependencies } from '../../CQRS/Contracts/IRequestHandlerDependencies.ts';

export class TransactionCreateCommandHandler extends CommandHandler<
    TransactionCreateCommand,
    ITransactionCreateResponse
> {
    public constructor({ currentUserContext, dbContext }: IRequestHandlerDependencies) {
        super({ currentUserContext, dbContext });
    }

    public override async execute(
        command: TransactionCreateCommand
    ): Promise<ITransactionCreateResponse> {
        const currentUserId = this.currentUserContext.requireCurrentUserId();
        const user = await this.dbContext.user.findUnique({
            where: {
                id: currentUserId,
            },
        });

        if (!user) {
            return {
                success: false,
                messages: ['User not found.'],
            };
        }

        const createdTransaction = await this.dbContext.transaction.create({
            data: {
                title: command.title,
                amount: command.amount,
                type: command.type,
                category: command.category,
                occurredAt: command.occurredAt,
                note: command.note,
                userId: currentUserId,
                updatedAt: new Date(),
            },
        });

        return {
            success: true,
            messages: [],
        };
    }
}

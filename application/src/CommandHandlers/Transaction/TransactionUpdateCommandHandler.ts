import { TransactionUpdateCommand, type ITransactionUpdateResponse } from '@pocketledger/contracts';
import { CommandHandler } from '../../CQRS/CommandHandler.ts';
import type { IRequestHandlerDependencies } from '../../CQRS/Contracts/IRequestHandlerDependencies.ts';

export class TransactionUpdateCommandHandler extends CommandHandler<
    TransactionUpdateCommand,
    ITransactionUpdateResponse
> {
    public constructor({ currentUserContext, dbContext }: IRequestHandlerDependencies) {
        super({ currentUserContext, dbContext });
    }

    public override async execute(
        command: TransactionUpdateCommand
    ): Promise<ITransactionUpdateResponse> {
        const currentUserId = this.currentUserContext.requireCurrentUserId();
        const existingTransaction = await this.dbContext.transaction.findFirst({
            where: {
                id: command.id,
                userId: currentUserId,
            },
        });

        if (!existingTransaction) {
            return {
                success: false,
                messages: ['Transaction not found.'],
            };
        }

        const updatedTransaction = await this.dbContext.transaction.update({
            where: {
                id: existingTransaction.id,
            },
            data: {
                title: command.title,
                amount: command.amount,
                type: command.type,
                category: command.category,
                occurredAt: command.occurredAt,
                note: command.note,
            },
        });

        return {
            success: true,
            messages: [],
        };
    }
}

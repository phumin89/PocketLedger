import { TransactionDeleteCommand, type ITransactionDeleteResponse } from '@pocketledger/contracts';
import { CommandHandler } from '../../CQRS/CommandHandler.ts';
import type { IRequestHandlerDependencies } from '../../CQRS/Contracts/IRequestHandlerDependencies.ts';

export class TransactionDeleteCommandHandler extends CommandHandler<
    TransactionDeleteCommand,
    ITransactionDeleteResponse
> {
    public constructor({ currentUserContext, dbContext }: IRequestHandlerDependencies) {
        super({ currentUserContext, dbContext });
    }

    public override async execute(
        command: TransactionDeleteCommand
    ): Promise<ITransactionDeleteResponse> {
        const currentUserId = this.currentUserContext.requireCurrentUserId();
        const deleteResult = await this.dbContext.transaction.deleteMany({
            where: {
                id: command.id,
                userId: currentUserId,
            },
        });

        if (deleteResult.count === 0) {
            return {
                success: false,
                messages: ['Transaction not found.'],
            };
        }

        return {
            success: true,
            messages: [],
        };
    }
}

import {
    TransactionDetailQuery,
    type ITransactionDetailResponse,
} from '@pocketledger/contracts';
import { QueryHandler } from '../../CQRS/QueryHandler.ts';
import { TransactionDtoMapper } from '../../Transactions/TransactionDtoMapper.ts';

export class TransactionDetailQueryHandler extends QueryHandler<
    TransactionDetailQuery,
    ITransactionDetailResponse
> {
    public override async execute(
        query: TransactionDetailQuery
    ): Promise<ITransactionDetailResponse> {
        const currentUserId = this.currentUserContext.requireCurrentUserId();
        const transaction = await this.dbContext.transaction.findFirst({
            where: {
                id: query.id,
                userId: currentUserId,
            },
        });

        return {
            transaction: transaction ? TransactionDtoMapper.Map(transaction) : null,
        };
    }
}

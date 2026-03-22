import { TransactionsListQuery, type ITransactionsListResponse } from '@pocketledger/contracts';
import { QueryHandler } from '../../CQRS/QueryHandler.ts';
import { TransactionDtoMapper } from '../../Transactions/TransactionDtoMapper.ts';

export class TransactionsListQueryHandler extends QueryHandler<
    TransactionsListQuery,
    ITransactionsListResponse
> {
    public override async execute(
        query: TransactionsListQuery
    ): Promise<ITransactionsListResponse> {
        const currentUserId = this.currentUserContext.requireCurrentUserId();
        const startOfDay = query.date;
        const endOfDay = new Date(startOfDay);

        endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

        const transactions = await this.dbContext.transaction.findMany({
            where: {
                occurredAt: {
                    gte: startOfDay,
                    lt: endOfDay,
                },
                userId: currentUserId,
            },
            orderBy: [
                {
                    occurredAt: 'desc',
                },
                {
                    createdAt: 'desc',
                },
            ],
        });

        return {
            transactions: transactions.map((transaction) => TransactionDtoMapper.Map(transaction)),
        };
    }
}

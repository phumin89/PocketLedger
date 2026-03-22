import { TransactionCategory, TransactionType, type ITransaction } from '@pocketledger/contracts';
import type { DatabaseTransactionModel } from '@pocketledger/database';

export class TransactionDtoMapper {
    public static Map(transaction: DatabaseTransactionModel): ITransaction {
        return {
            id: transaction.id,
            title: transaction.title,
            amount: transaction.amount.toString(),
            type: transaction.type as TransactionType,
            category: transaction.category as TransactionCategory,
            occurredAt: transaction.occurredAt.toISOString().slice(0, 10),
            note: transaction.note,
            createdAt: transaction.createdAt.toISOString(),
            updatedAt: transaction.updatedAt.toISOString(),
        };
    }
}

import type { TransactionCategory } from '../../../../enum/transaction-category.enum.ts';
import type { TransactionType } from '../../../../enum/transaction-type.enum.ts';

export interface ITransactionCreateRequest {
    title: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    occurredAt: string;
    note: string;
}

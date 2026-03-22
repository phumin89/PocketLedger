import type { TransactionCategory } from '../enum/transaction-category.enum.ts';
import type { TransactionType } from '../enum/transaction-type.enum.ts';

export interface ITransaction {
    id: string;
    title: string;
    amount: string;
    type: TransactionType;
    category: TransactionCategory;
    occurredAt: string;
    note: string;
    createdAt: string;
    updatedAt: string;
}

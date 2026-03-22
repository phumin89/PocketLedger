import type { TransactionCategory, TransactionType } from '@pocketledger/contracts';

export type TransactionFormData = {
    id: string;
    title: string;
    amount: string;
    type: TransactionType;
    category: TransactionCategory;
    occurredAt: string;
    note: string;
};

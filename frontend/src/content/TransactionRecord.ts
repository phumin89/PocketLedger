import type { TransactionFormData } from './TransactionFormData.ts';

export type TransactionRecord = TransactionFormData & {
    createdAt: string;
    updatedAt: string;
    source: string;
};

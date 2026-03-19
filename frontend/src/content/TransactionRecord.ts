import type { TransactionFormData } from './TransactionFormData';

export type TransactionRecord = TransactionFormData & {
    createdAt: string;
    updatedAt: string;
    source: string;
};

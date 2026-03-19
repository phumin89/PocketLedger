import type { TransactionFormData } from '../content/TransactionFormData';
import type { TransactionRecord } from '../content/TransactionRecord';

export type TransactionsStoreValue = {
    transactions: TransactionRecord[];
    categories: string[];
    accounts: string[];
    years: number[];
    getTransactionById: (id: string) => TransactionRecord | undefined;
    createTransactionForDate: (occurredAt: string) => TransactionRecord;
    updateTransaction: (id: string, draft: TransactionFormData) => void;
    deleteTransaction: (id: string) => void;
};

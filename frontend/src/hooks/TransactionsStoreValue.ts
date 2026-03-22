import type { TransactionFormData } from '../content/TransactionFormData';
import type { TransactionRecord } from '../content/TransactionRecord';

export type TransactionsStoreValue = {
    error: string | null;
    isLoading: boolean;
    isMutating: boolean;
    transactions: TransactionRecord[];
    years: number[];
    createTransaction: (draft: TransactionFormData) => Promise<boolean>;
    deleteTransaction: (id: string) => Promise<boolean>;
    getTransactionById: (id: string) => TransactionRecord | undefined;
    loadTransactionById: (id: string, signal?: AbortSignal) => Promise<TransactionRecord | null>;
    loadTransactionsForDate: (date: string, signal?: AbortSignal) => Promise<void>;
    refreshTransactions: () => Promise<void>;
    updateTransaction: (draft: TransactionFormData) => Promise<boolean>;
};

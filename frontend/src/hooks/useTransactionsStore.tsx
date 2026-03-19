import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import {
    initialTransactionRecords,
    transactionAccounts,
    transactionCategories,
} from '../content/transaction-mock';
import type { TransactionFormData } from '../content/TransactionFormData';
import type { TransactionRecord } from '../content/TransactionRecord';
import type { TransactionsStoreValue } from './TransactionsStoreValue';

const TransactionsStoreContext = createContext<TransactionsStoreValue | null>(null);

export function TransactionsStoreProvider({ children }: { children: ReactNode }) {
    const [transactions, setTransactions] = useState(initialTransactionRecords);

    const years = useMemo(() => {
        return [
            ...new Set(
                transactions.map((transaction) => Number(transaction.occurredAt.slice(0, 4)))
            ),
        ].sort((left, right) => right - left);
    }, [transactions]);

    function getTransactionById(id: string) {
        return transactions.find((transaction) => transaction.id === id);
    }

    function createTransactionForDate(occurredAt: string) {
        const timestamp = Date.now();
        const nextRecord: TransactionRecord = {
            id: `txn-${occurredAt}-${timestamp}`,
            title: 'New transaction',
            amount: '0',
            type: 'EXPENSE',
            category: 'Bills',
            occurredAt,
            account: transactionAccounts[0],
            reference: `MANUAL-${occurredAt.replaceAll('-', '')}`,
            note: '',
            status: 'Draft',
            createdAt: new Date(timestamp).toLocaleString(),
            updatedAt: new Date(timestamp).toLocaleString(),
            source: 'Mock transaction record',
        };

        setTransactions((current) => [nextRecord, ...current]);

        return nextRecord;
    }

    function updateTransaction(id: string, draft: TransactionFormData) {
        setTransactions((current) =>
            current.map((transaction) =>
                transaction.id === id
                    ? {
                          ...transaction,
                          ...draft,
                          updatedAt: new Date().toLocaleString(),
                      }
                    : transaction
            )
        );
    }

    function deleteTransaction(id: string) {
        setTransactions((current) => current.filter((transaction) => transaction.id !== id));
    }

    const value = useMemo<TransactionsStoreValue>(
        () => ({
            transactions,
            categories: transactionCategories,
            accounts: transactionAccounts,
            years,
            getTransactionById,
            createTransactionForDate,
            updateTransaction,
            deleteTransaction,
        }),
        [transactions, years]
    );

    return (
        <TransactionsStoreContext.Provider value={value}>
            {children}
        </TransactionsStoreContext.Provider>
    );
}

export function useTransactionsStore() {
    const context = useContext(TransactionsStoreContext);

    if (!context) {
        throw new Error('useTransactionsStore must be used within TransactionsStoreProvider.');
    }

    return context;
}

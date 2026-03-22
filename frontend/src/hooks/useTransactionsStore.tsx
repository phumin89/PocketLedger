import {
    type ITransaction,
    type ITransactionCreateRequest,
    type ITransactionDetailResponse,
    type ITransactionUpdateRequest,
} from '@pocketledger/contracts';
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import { frontendServices } from '../composition/frontendServices';
import type { TransactionFormData } from '../content/TransactionFormData';
import type { TransactionRecord } from '../content/TransactionRecord';
import { ApiError } from '../services/api/ApiError';
import type { TransactionsStoreValue } from './TransactionsStoreValue';

const TransactionsStoreContext = createContext<TransactionsStoreValue | null>(null);

export function TransactionsStoreProvider({ children }: { children: ReactNode }) {
    const transactionsService = frontendServices.transactionsService;
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isMutating, setIsMutating] = useState(false);
    const [loadedDate, setLoadedDate] = useState<string | null>(null);
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [transactionsById, setTransactionsById] = useState<Record<string, ITransaction>>({});
    const listRequestSequence = useRef(0);

    const years = useMemo(() => {
        const currentYear = new Date().getUTCFullYear();

        return Array.from({ length: 10 }, (_, offset) => currentYear - offset);
    }, []);

    const getTransactionById = useCallback(
        (id: string): TransactionRecord | undefined => {
            return transactionsById[id];
        },
        [transactionsById]
    );

    const fetchTransactionById = useCallback(
        async (id: string, signal?: AbortSignal): Promise<TransactionRecord | null> => {
            const transactionDetailResponse: ITransactionDetailResponse =
                await transactionsService.getTransactionById(id, signal);
            const transaction = transactionDetailResponse.transaction;

            if (!transaction) {
                return null;
            }

            setTransactionsById((current) => ({
                ...current,
                [transaction.id]: transaction,
            }));
            setError(null);

            return transaction;
        },
        [transactionsService]
    );

    const loadTransactionById = useCallback(
        async (id: string, signal?: AbortSignal): Promise<TransactionRecord | null> => {
            const cachedTransaction = transactionsById[id];

            if (cachedTransaction) {
                return cachedTransaction;
            }

            try {
                return await fetchTransactionById(id, signal);
            } catch (loadTransactionError) {
                if (
                    loadTransactionError instanceof DOMException &&
                    loadTransactionError.name === 'AbortError'
                ) {
                    return null;
                }

                setError(resolveErrorMessage(loadTransactionError, 'Failed to load transaction.'));

                return null;
            }
        },
        [fetchTransactionById, transactionsById]
    );

    const loadTransactionsForDate = useCallback(
        async (date: string, signal?: AbortSignal): Promise<void> => {
            const requestSequence = ++listRequestSequence.current;

            setIsLoading(true);
            setLoadedDate(date);

            try {
                const transactionsListResponse = await transactionsService.getTransactions(
                    date,
                    signal
                );
                const sortedTransactions = sortTransactions(transactionsListResponse.transactions);

                if (listRequestSequence.current !== requestSequence) {
                    return;
                }

                setTransactions(sortedTransactions);
                setTransactionsById((current) => {
                    const nextTransactionsById = { ...current };

                    for (const transaction of sortedTransactions) {
                        nextTransactionsById[transaction.id] = transaction;
                    }

                    return nextTransactionsById;
                });
                setError(null);
            } catch (loadTransactionsError) {
                if (
                    loadTransactionsError instanceof DOMException &&
                    loadTransactionsError.name === 'AbortError'
                ) {
                    return;
                }

                if (listRequestSequence.current !== requestSequence) {
                    return;
                }

                setTransactions([]);
                setError(
                    resolveErrorMessage(loadTransactionsError, 'Failed to load transactions.')
                );
            } finally {
                if (listRequestSequence.current === requestSequence) {
                    setIsLoading(false);
                }
            }
        },
        [transactionsService]
    );

    const refreshTransactions = useCallback(async (): Promise<void> => {
        if (!loadedDate) {
            return;
        }

        await loadTransactionsForDate(loadedDate);
    }, [loadTransactionsForDate, loadedDate]);

    const createTransaction = useCallback(
        async (draft: TransactionFormData): Promise<boolean> => {
            setIsMutating(true);

            try {
                const createTransactionResponse = await transactionsService.createTransaction(
                    toCreateTransactionRequest(draft)
                );

                if (!createTransactionResponse.success) {
                    setError(
                        createTransactionResponse.messages[0] ?? 'Failed to create transaction.'
                    );
                    return false;
                }

                if (loadedDate === draft.occurredAt) {
                    await loadTransactionsForDate(loadedDate);
                }

                setError(null);

                return true;
            } catch (createTransactionError) {
                setError(
                    resolveErrorMessage(createTransactionError, 'Failed to create transaction.')
                );

                return false;
            } finally {
                setIsMutating(false);
            }
        },
        [loadTransactionsForDate, loadedDate, transactionsService]
    );

    const updateTransaction = useCallback(
        async (draft: TransactionFormData): Promise<boolean> => {
            setIsMutating(true);

            try {
                const existingTransaction = transactionsById[draft.id];
                const updateTransactionResponse = await transactionsService.updateTransaction(
                    toUpdateTransactionRequest(draft)
                );

                if (!updateTransactionResponse.success) {
                    setError(
                        updateTransactionResponse.messages[0] ?? 'Failed to update transaction.'
                    );
                    return false;
                }

                if (
                    loadedDate &&
                    (loadedDate === draft.occurredAt ||
                        existingTransaction?.occurredAt === loadedDate)
                ) {
                    await loadTransactionsForDate(loadedDate);
                }

                await fetchTransactionById(draft.id);
                setError(null);

                return true;
            } catch (updateTransactionError) {
                setError(
                    resolveErrorMessage(updateTransactionError, 'Failed to update transaction.')
                );

                return false;
            } finally {
                setIsMutating(false);
            }
        },
        [
            fetchTransactionById,
            loadTransactionsForDate,
            loadedDate,
            transactionsById,
            transactionsService,
        ]
    );

    const deleteTransaction = useCallback(
        async (id: string): Promise<boolean> => {
            setIsMutating(true);

            try {
                const deleteTransactionResponse = await transactionsService.deleteTransaction({
                    id,
                });

                if (!deleteTransactionResponse.success) {
                    setError(
                        deleteTransactionResponse.messages[0] ?? 'Failed to delete transaction.'
                    );
                    return false;
                }

                setTransactionsById((current) => {
                    const nextTransactionsById = { ...current };

                    delete nextTransactionsById[id];

                    return nextTransactionsById;
                });
                setTransactions((current) =>
                    current.filter((transaction) => transaction.id !== id)
                );
                setError(null);

                return true;
            } catch (deleteTransactionError) {
                setError(
                    resolveErrorMessage(deleteTransactionError, 'Failed to delete transaction.')
                );

                return false;
            } finally {
                setIsMutating(false);
            }
        },
        [transactionsService]
    );

    function resolveErrorMessage(error: unknown, fallbackMessage: string): string {
        if (error instanceof ApiError && error.message.trim().length > 0) {
            return error.message;
        }

        return error instanceof Error ? error.message : fallbackMessage;
    }

    function toCreateTransactionRequest(draft: TransactionFormData): ITransactionCreateRequest {
        return {
            title: draft.title,
            amount: Number(draft.amount),
            type: draft.type,
            category: draft.category,
            occurredAt: draft.occurredAt,
            note: draft.note,
        };
    }

    function toUpdateTransactionRequest(draft: TransactionFormData): ITransactionUpdateRequest {
        return {
            id: draft.id,
            title: draft.title,
            amount: Number(draft.amount),
            type: draft.type,
            category: draft.category,
            occurredAt: draft.occurredAt,
            note: draft.note,
        };
    }

    const value = useMemo<TransactionsStoreValue>(
        () => ({
            error,
            isLoading,
            isMutating,
            transactions,
            years,
            getTransactionById,
            loadTransactionById,
            loadTransactionsForDate,
            createTransaction,
            deleteTransaction,
            refreshTransactions,
            updateTransaction,
        }),
        [
            createTransaction,
            deleteTransaction,
            error,
            getTransactionById,
            isLoading,
            isMutating,
            loadTransactionById,
            loadTransactionsForDate,
            refreshTransactions,
            transactions,
            updateTransaction,
            years,
        ]
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

function sortTransactions(transactions: readonly ITransaction[]): ITransaction[] {
    return [...transactions].sort((left, right) => {
        if (left.occurredAt !== right.occurredAt) {
            return right.occurredAt.localeCompare(left.occurredAt);
        }

        if (left.createdAt !== right.createdAt) {
            return right.createdAt.localeCompare(left.createdAt);
        }

        return right.updatedAt.localeCompare(left.updatedAt);
    });
}

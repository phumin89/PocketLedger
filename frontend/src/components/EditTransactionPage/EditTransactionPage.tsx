import {
    DefaultTransactionCategoryByType,
    TransactionCategoriesByType,
    TransactionCategory,
    TransactionType,
    type ITransaction,
} from '@pocketledger/contracts';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { TransactionFormData } from '../../content/TransactionFormData';
import { useTransactionEditor } from '../../hooks/useTransactionEditor';
import { useTransactionsStore } from '../../hooks/useTransactionsStore';
import { ConfirmationDialog } from '../ConfirmationDialog/ConfirmationDialog';
import { SidePanel } from '../SidePanel/SidePanel';
import styles from './EditTransactionPage.module.scss';
import type { EditTransactionPageProps } from './EditTransactionPageProps';
import { getTransactionFormErrors } from './getTransactionFormErrors';

export function EditTransactionPage({ transactionId }: EditTransactionPageProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        createTransaction,
        deleteTransaction,
        error,
        getTransactionById,
        isLoading,
        isMutating,
        loadTransactionById,
        updateTransaction,
    } = useTransactionsStore();
    const isNewTransaction = transactionId === 'new';
    const initialOccurredAt = resolveInitialOccurredAt(location.state);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [isDiscardConfirmationOpen, setIsDiscardConfirmationOpen] = useState(false);
    const [isResolvingTransaction, setIsResolvingTransaction] = useState(
        !isNewTransaction && transactionId !== undefined && !getTransactionById(transactionId)
    );
    const transaction =
        !isNewTransaction && transactionId !== undefined
            ? getTransactionById(transactionId)
            : undefined;

    useEffect(() => {
        if (isNewTransaction || !transactionId) {
            setIsResolvingTransaction(false);
            return;
        }

        if (transaction) {
            setIsResolvingTransaction(false);
            return;
        }

        const abortController = new AbortController();
        let isMounted = true;

        setIsResolvingTransaction(true);

        void loadTransactionById(transactionId, abortController.signal).finally(() => {
            if (isMounted) {
                setIsResolvingTransaction(false);
            }
        });

        return () => {
            isMounted = false;
            abortController.abort();
        };
    }, [isNewTransaction, loadTransactionById, transaction, transactionId]);

    const initialTransaction = useMemo<TransactionFormData>(() => {
        if (transaction) {
            return buildTransactionFormData(transaction);
        }

        if (isNewTransaction) {
            return buildNewTransactionFormData(initialOccurredAt);
        }

        return buildNewTransactionFormData('');
    }, [initialOccurredAt, isNewTransaction, transaction]);
    const { draft, notice, isDirty, updateField, reset } = useTransactionEditor(initialTransaction);
    const availableCategories = useMemo(() => {
        return TransactionCategoriesByType[draft.type];
    }, [draft.type]);
    const validationErrors = useMemo(() => getTransactionFormErrors(draft), [draft]);
    const isFormValid = useMemo(() => {
        return Object.values(validationErrors).every((error) => error === null);
    }, [validationErrors]);

    useEffect(() => {
        if (availableCategories.includes(draft.category)) {
            return;
        }

        updateField('category', DefaultTransactionCategoryByType[draft.type]);
    }, [availableCategories, draft.category, draft.type, updateField]);

    useEffect(() => {
        if (!isDirty) {
            return;
        }

        function handleBeforeUnload(event: BeforeUnloadEvent): void {
            event.preventDefault();
            event.returnValue = '';
        }

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDirty]);

    function navigateBackToTransactions(): void {
        navigate('/transactions', {
            state: {
                occurredAt: draft.occurredAt || initialOccurredAt,
            },
        });
    }

    function requestClosePanel(): void {
        if (isMutating) {
            return;
        }

        if (isDirty) {
            setIsDiscardConfirmationOpen(true);
            return;
        }

        navigateBackToTransactions();
    }

    if ((isLoading || isResolvingTransaction) && !isNewTransaction && !transaction) {
        return (
            <SidePanel
                description="Pocket ledger is preparing this record."
                kicker="Transactions"
                onClose={requestClosePanel}
                title="Loading transaction"
            >
                <section className={styles.stateCard}>
                    <h3 className={styles.stateTitle}>One moment</h3>
                    <p className={styles.stateText}>The editor is loading this transaction.</p>
                </section>
            </SidePanel>
        );
    }

    if (!isNewTransaction && !transaction) {
        return (
            <SidePanel
                description="That record is not available in the active account."
                kicker="Transactions"
                onClose={requestClosePanel}
                title="Transaction unavailable"
            >
                <section className={styles.stateCard}>
                    <h3 className={styles.stateTitle}>We couldn&apos;t find that transaction</h3>
                    <p className={styles.stateText}>
                        Try going back to the list and opening the entry again.
                    </p>
                </section>
            </SidePanel>
        );
    }

    async function handleSave(): Promise<void> {
        if (isNewTransaction) {
            const isCreated = await createTransaction(draft);

            if (!isCreated) {
                return;
            }

            navigate('/transactions', {
                replace: true,
                state: {
                    occurredAt: draft.occurredAt,
                },
            });
            return;
        }

        const isUpdated = await updateTransaction(draft);

        if (!isUpdated) {
            return;
        }

        navigateBackToTransactions();
    }

    async function handleDelete(): Promise<void> {
        if (isNewTransaction) {
            navigate('/transactions');
            return;
        }

        const isDeleted = await deleteTransaction(draft.id);

        if (!isDeleted) {
            return;
        }

        navigate('/transactions', {
            state: {
                occurredAt: draft.occurredAt,
            },
        });
    }

    return (
        <SidePanel
            description={
                isNewTransaction
                    ? 'Add the details and save when this entry is ready.'
                    : 'Update the details for this entry and save when you are done.'
            }
            footer={(requestClose) => (
                <div className={styles.panelActions}>
                    <button className={styles.ghostButton} onClick={requestClose} type="button">
                        Cancel
                    </button>
                    <div className={styles.panelActionsEnd}>
                        <button
                            className={styles.ghostButton}
                            disabled={!isDirty || isMutating}
                            onClick={reset}
                            type="button"
                        >
                            Reset
                        </button>
                        <button
                            className={styles.primaryButton}
                            disabled={!isDirty || !isFormValid || isMutating}
                            onClick={() => void handleSave()}
                            type="button"
                        >
                            {isNewTransaction ? 'Create transaction' : 'Save changes'}
                        </button>
                    </div>
                </div>
            )}
            kicker="Transactions"
            onClose={requestClosePanel}
            title={isNewTransaction ? 'Create transaction' : 'Edit transaction'}
        >
            {error ? <p className={styles.notice}>{error}</p> : null}
            {!error && notice ? <p className={styles.notice}>{notice}</p> : null}

            <section className={styles.panelStack}>
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <p className={styles.sectionKicker}>Details</p>
                        <p className={styles.sectionHint}>
                            Fill out the fields below to save this entry.
                        </p>
                    </div>

                    <form className={styles.formCard}>
                        <div className={styles.formGrid}>
                            <label className={styles.field}>
                                <span>Title</span>
                                <input
                                    aria-invalid={validationErrors.title ? 'true' : 'false'}
                                    type="text"
                                    value={draft.title}
                                    onChange={(event) => updateField('title', event.target.value)}
                                />
                                {validationErrors.title ? (
                                    <small className={styles.fieldError}>
                                        {validationErrors.title}
                                    </small>
                                ) : null}
                            </label>

                            <label className={styles.field}>
                                <span>Amount</span>
                                <input
                                    aria-invalid={validationErrors.amount ? 'true' : 'false'}
                                    type="number"
                                    inputMode="decimal"
                                    value={draft.amount}
                                    onChange={(event) => updateField('amount', event.target.value)}
                                />
                                {validationErrors.amount ? (
                                    <small className={styles.fieldError}>
                                        {validationErrors.amount}
                                    </small>
                                ) : null}
                            </label>

                            <label className={styles.field}>
                                <span>Type</span>
                                <select
                                    value={draft.type}
                                    onChange={(event) => {
                                        const nextType =
                                            event.target.value as TransactionFormData['type'];
                                        const nextCategory = TransactionCategoriesByType[
                                            nextType
                                        ].includes(draft.category)
                                            ? draft.category
                                            : DefaultTransactionCategoryByType[nextType];

                                        updateField('type', nextType);

                                        if (nextCategory !== draft.category) {
                                            updateField('category', nextCategory);
                                        }
                                    }}
                                >
                                    <option value="INCOME">Income</option>
                                    <option value="EXPENSE">Expense</option>
                                </select>
                            </label>

                            <label className={styles.field}>
                                <span>Category</span>
                                <select
                                    value={draft.category}
                                    onChange={(event) =>
                                        updateField(
                                            'category',
                                            event.target.value as TransactionFormData['category']
                                        )
                                    }
                                >
                                    {availableCategories.map((category) => (
                                        <option key={category} value={category}>
                                            {formatLabel(category)}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className={styles.field}>
                                <span>Date</span>
                                <input
                                    aria-invalid={validationErrors.occurredAt ? 'true' : 'false'}
                                    type="date"
                                    value={draft.occurredAt}
                                    onChange={(event) =>
                                        updateField('occurredAt', event.target.value)
                                    }
                                />
                                {validationErrors.occurredAt ? (
                                    <small className={styles.fieldError}>
                                        {validationErrors.occurredAt}
                                    </small>
                                ) : null}
                            </label>

                            <label className={styles.fieldFull}>
                                <span>Note</span>
                                <textarea
                                    aria-invalid={validationErrors.note ? 'true' : 'false'}
                                    rows={5}
                                    value={draft.note}
                                    onChange={(event) => updateField('note', event.target.value)}
                                />
                                {validationErrors.note ? (
                                    <small className={styles.fieldError}>
                                        {validationErrors.note}
                                    </small>
                                ) : (
                                    <small className={styles.fieldHint}>
                                        {draft.note.trim().length}/500 characters
                                    </small>
                                )}
                            </label>
                        </div>
                    </form>
                </section>

                {!isNewTransaction ? (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <p className={styles.sectionKicker}>Record details</p>
                        </div>

                        <article className={styles.metaCard}>
                            <h2 className={styles.sideTitle}>{draft.id}</h2>
                            <dl className={styles.metaList}>
                                <div>
                                    <dt>Created</dt>
                                    <dd>{formatTransactionDateTime(transaction?.createdAt)}</dd>
                                </div>
                                <div>
                                    <dt>Updated</dt>
                                    <dd>{formatTransactionDateTime(transaction?.updatedAt)}</dd>
                                </div>
                            </dl>
                        </article>
                    </section>
                ) : null}

                {!isNewTransaction ? (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <p className={styles.sectionKicker}>Danger zone</p>
                        </div>

                        <article className={styles.dangerCard}>
                            <p className={styles.sideText}>
                                Deleting removes this entry from the current account right away.
                            </p>
                            <button
                                className={styles.deleteButton}
                                disabled={isMutating}
                                onClick={() => setIsDeleteConfirmationOpen(true)}
                                type="button"
                            >
                                Delete transaction
                            </button>
                        </article>
                    </section>
                ) : null}
            </section>

            <ConfirmationDialog
                confirmLabel="Delete"
                description="This transaction will be removed from the current account."
                isBusy={isMutating}
                isOpen={isDeleteConfirmationOpen}
                onCancel={() => setIsDeleteConfirmationOpen(false)}
                onConfirm={() => void handleDelete()}
                title="Delete this transaction?"
            />

            <ConfirmationDialog
                confirmLabel="Discard changes"
                description="Your edits have not been saved yet."
                isBusy={isMutating}
                isOpen={isDiscardConfirmationOpen}
                onCancel={() => setIsDiscardConfirmationOpen(false)}
                onConfirm={() => {
                    setIsDiscardConfirmationOpen(false);
                    navigateBackToTransactions();
                }}
                title="Discard your changes?"
            />
        </SidePanel>
    );
}

function buildTransactionFormData(transaction: ITransaction): TransactionFormData {
    return {
        id: transaction.id,
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        occurredAt: transaction.occurredAt,
        note: transaction.note,
    };
}

function buildNewTransactionFormData(occurredAt: string): TransactionFormData {
    return {
        id: 'new',
        title: '',
        amount: '',
        type: TransactionType.EXPENSE,
        category: DefaultTransactionCategoryByType[TransactionType.EXPENSE],
        occurredAt,
        note: '',
    };
}

function resolveInitialOccurredAt(state: unknown): string {
    if (
        state &&
        typeof state === 'object' &&
        'occurredAt' in state &&
        typeof state.occurredAt === 'string'
    ) {
        return state.occurredAt;
    }

    return new Date().toISOString().slice(0, 10);
}

function formatLabel(value: string) {
    return value
        .split('_')
        .map((segment) => segment.charAt(0) + segment.slice(1).toLowerCase())
        .join(' ');
}

function formatTransactionDateTime(value: string | undefined): string {
    if (!value) {
        return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '-';
    }

    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

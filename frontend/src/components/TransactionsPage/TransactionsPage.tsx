import { useEffect, useMemo, useState } from 'react';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import { useTransactionsStore } from '../../hooks/useTransactionsStore';
import { ConfirmationDialog } from '../ConfirmationDialog/ConfirmationDialog';
import { EditTransactionPage } from '../EditTransactionPage/EditTransactionPage';
import styles from './TransactionsPage.module.scss';

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
const weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const selectedDateFormatter = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});
const transactionFilters = ['ALL', 'INCOME', 'EXPENSE'] as const;

export function TransactionsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const createRouteMatch = useMatch('/transactions/new/edit');
    const editRouteMatch = useMatch('/transactions/:transactionId/edit');
    const {
        error,
        isLoading,
        isMutating,
        transactions,
        years,
        deleteTransaction,
        loadTransactionsForDate,
    } = useTransactionsStore();
    const initialDate = useMemo(() => {
        const occurredAt = resolveInitialOccurredAt(location.state);

        return new Date(`${occurredAt}T00:00:00.000Z`);
    }, [location.state]);

    const [selectedYear, setSelectedYear] = useState<number>(() => initialDate.getUTCFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(initialDate.getUTCMonth());
    const [selectedDay, setSelectedDay] = useState<number>(initialDate.getUTCDate());
    const [selectedFilter, setSelectedFilter] = useState<(typeof transactionFilters)[number]>('ALL');
    const [pendingDeleteTransactionId, setPendingDeleteTransactionId] = useState<string | null>(
        null
    );

    useEffect(() => {
        if (!years.includes(selectedYear) && years.length > 0) {
            setSelectedYear(years[0]);
        }
    }, [selectedYear, years]);

    const months = useMemo(() => {
        return Array.from({ length: 12 }, (_, monthIndex) => {
            return {
                index: monthIndex,
                label: monthFormatter.format(new Date(Date.UTC(selectedYear, monthIndex, 1))),
            };
        });
    }, [selectedYear]);

    const daysInMonth = useMemo(
        () => new Date(Date.UTC(selectedYear, selectedMonth + 1, 0)).getUTCDate(),
        [selectedMonth, selectedYear]
    );

    const days = useMemo(() => {
        return Array.from({ length: daysInMonth }, (_, offset) => {
            const dayNumber = offset + 1;
            const key = formatDate(selectedYear, selectedMonth, dayNumber);

            return {
                dayNumber,
                key,
                label: weekdayFormatter.format(
                    new Date(Date.UTC(selectedYear, selectedMonth, dayNumber))
                ),
            };
        });
    }, [daysInMonth, selectedMonth, selectedYear]);

    const effectiveSelectedDay = Math.min(selectedDay, daysInMonth);
    const selectedDate = formatDate(selectedYear, selectedMonth, effectiveSelectedDay);
    const selectedDateLabel = selectedDateFormatter.format(
        new Date(Date.UTC(selectedYear, selectedMonth, effectiveSelectedDay))
    );
    const activeTransactionId = createRouteMatch ? 'new' : editRouteMatch?.params.transactionId;
    const activeFilterIndex = transactionFilters.indexOf(selectedFilter);
    const filteredTransactions = useMemo(() => {
        if (selectedFilter === 'ALL') {
            return transactions;
        }

        return transactions.filter((transaction) => transaction.type === selectedFilter);
    }, [selectedFilter, transactions]);
    const summary = useMemo(() => {
        const incomeTotal = transactions.reduce((total, transaction) => {
            return transaction.type === 'INCOME' ? total + Number(transaction.amount) : total;
        }, 0);
        const expenseTotal = transactions.reduce((total, transaction) => {
            return transaction.type === 'EXPENSE' ? total + Number(transaction.amount) : total;
        }, 0);

        return {
            incomeTotal,
            expenseTotal,
            netTotal: incomeTotal - expenseTotal,
        };
    }, [transactions]);
    const netSummaryClassName =
        summary.netTotal >= 0 ? styles.summaryValuePositive : styles.summaryValueNegative;

    useEffect(() => {
        if (selectedDay !== effectiveSelectedDay) {
            setSelectedDay(effectiveSelectedDay);
        }
    }, [effectiveSelectedDay, selectedDay]);

    useEffect(() => {
        const abortController = new AbortController();

        void loadTransactionsForDate(selectedDate, abortController.signal);

        return () => {
            abortController.abort();
        };
    }, [loadTransactionsForDate, selectedDate]);

    function handleCreateTransaction() {
        navigate('/transactions/new/edit', {
            state: {
                occurredAt: selectedDate,
            },
        });
    }

    async function handleDeleteTransaction(): Promise<void> {
        if (!pendingDeleteTransactionId) {
            return;
        }

        const isDeleted = await deleteTransaction(pendingDeleteTransactionId);

        if (isDeleted) {
            setPendingDeleteTransactionId(null);
        }
    }

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <div>
                    <p className={styles.kicker}>Transactions</p>
                    <h1 className={styles.title}>Find transactions by date</h1>
                    <p className={styles.subtitle}>
                        Choose a day and Pocket ledger will load that date&apos;s entries.
                    </p>
                    {error ? <p className={styles.subtitle}>{error}</p> : null}
                </div>

                <label className={styles.yearPicker}>
                    <span>Year</span>
                    <select
                        disabled={isLoading}
                        value={selectedYear}
                        onChange={(event) => setSelectedYear(Number(event.target.value))}
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </label>
            </header>

            <section className={styles.grid}>
                <aside className={styles.monthsCard}>
                    <div className={styles.sectionHeader}>
                        <p className={styles.sectionKicker}>Month</p>
                        <strong>{selectedYear}</strong>
                    </div>

                    <div className={styles.monthList}>
                        {months.map((month) => (
                            <button
                                className={
                                    month.index === selectedMonth
                                        ? styles.monthButtonActive
                                        : styles.monthButton
                                }
                                disabled={isLoading}
                                key={month.label}
                                onClick={() => setSelectedMonth(month.index)}
                                type="button"
                            >
                                <span>{month.label}</span>
                            </button>
                        ))}
                    </div>
                </aside>

                <section className={styles.daysCard}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <p className={styles.sectionKicker}>Day</p>
                            <strong>
                                {monthFormatter.format(
                                    new Date(Date.UTC(selectedYear, selectedMonth, 1))
                                )}
                            </strong>
                        </div>
                        <span className={styles.helperText}>Pick a day to load that date</span>
                    </div>

                    <div className={styles.daysGrid}>
                        {days.map((day) => (
                            <button
                                className={
                                    day.dayNumber === selectedDay
                                        ? styles.dayButtonActive
                                        : styles.dayButton
                                }
                                disabled={isLoading}
                                key={day.key}
                                onClick={() => setSelectedDay(day.dayNumber)}
                                type="button"
                            >
                                <strong>{day.dayNumber}</strong>
                                <small>{day.label}</small>
                            </button>
                        ))}
                    </div>
                </section>

                <section className={styles.listCard}>
                    <div className={styles.listHeader}>
                        <div>
                            <p className={styles.sectionKicker}>Transactions</p>
                            <strong>{selectedDateLabel}</strong>
                        </div>
                        <button
                            className={styles.addButton}
                            disabled={isLoading || isMutating}
                            onClick={handleCreateTransaction}
                            type="button"
                        >
                            Add transaction
                        </button>
                    </div>

                    <div className={styles.summaryGrid}>
                        <article className={styles.summaryCard}>
                            <span className={styles.summaryLabel}>Inflow</span>
                            <strong className={styles.summaryValue}>
                                {formatMoney(summary.incomeTotal)}
                            </strong>
                        </article>
                        <article className={styles.summaryCard}>
                            <span className={styles.summaryLabel}>Outflow</span>
                            <strong className={styles.summaryValue}>
                                {formatMoney(summary.expenseTotal)}
                            </strong>
                        </article>
                        <article className={styles.summaryCard}>
                            <span className={styles.summaryLabel}>Net</span>
                            <strong
                                className={`${styles.summaryValue} ${netSummaryClassName}`}
                            >
                                {formatMoney(summary.netTotal)}
                            </strong>
                        </article>
                    </div>

                    <div className={styles.listToolbar}>
                        <div
                            className={styles.filterGroup}
                            style={{
                                ['--active-filter-index' as string]: activeFilterIndex.toString(),
                            }}
                        >
                            <span className={styles.filterIndicator} />
                            {transactionFilters.map((filter) => (
                                <button
                                    className={
                                        filter === selectedFilter
                                            ? styles.filterButtonActive
                                            : styles.filterButton
                                    }
                                    disabled={isLoading}
                                    key={filter}
                                    onClick={() => setSelectedFilter(filter)}
                                    type="button"
                                >
                                    {formatFilterLabel(filter)}
                                </button>
                            ))}
                        </div>
                        <span className={styles.helperText}>
                            Showing {filteredTransactions.length} of {transactions.length} entries
                        </span>
                    </div>

                    <div className={styles.listBody}>
                        {transactions.length === 0 ? (
                            <div className={styles.emptyState}>
                                <h2>Nothing recorded for this day yet</h2>
                                <p>Add a new entry to record this day.</p>
                            </div>
                        ) : filteredTransactions.length === 0 ? (
                            <div className={styles.emptyState}>
                                <h2>No {formatFilterLabel(selectedFilter).toLowerCase()} entries yet</h2>
                                <p>Try a different filter or add a new transaction.</p>
                            </div>
                        ) : (
                            <div className={styles.transactionList}>
                                {filteredTransactions.map((transaction) => (
                                    <article
                                        className={`${styles.transactionItem} ${
                                            transaction.type === 'INCOME'
                                                ? styles.transactionItemIncome
                                                : styles.transactionItemExpense
                                        }`}
                                        key={transaction.id}
                                    >
                                        <div className={styles.transactionMain}>
                                            <div>
                                                <h2 className={styles.transactionTitle}>
                                                    {transaction.title}
                                                </h2>
                                                <div className={styles.transactionMetaRow}>
                                                    <span
                                                        className={`${
                                                            styles.transactionTypeBadge
                                                        } ${
                                                            transaction.type === 'INCOME'
                                                                ? styles.transactionTypeBadgeIncome
                                                                : styles.transactionTypeBadgeExpense
                                                        }`}
                                                    >
                                                        {formatLabel(transaction.type)}
                                                    </span>
                                                    <p className={styles.transactionMeta}>
                                                        {formatLabel(transaction.category)}
                                                    </p>
                                                </div>
                                            </div>
                                            <strong
                                                className={`${
                                                    styles.transactionAmount
                                                } ${
                                                    transaction.type === 'INCOME'
                                                        ? styles.transactionAmountIncome
                                                        : styles.transactionAmountExpense
                                                }`}
                                            >
                                                {transaction.type === 'INCOME' ? '+' : '-'}
                                                {Number(transaction.amount).toLocaleString()}
                                            </strong>
                                        </div>
                                        <p className={styles.transactionNote}>
                                            {transaction.note || 'No note added'}
                                        </p>
                                        <div className={styles.transactionActions}>
                                            <button
                                                className={styles.inlineButton}
                                                disabled={isLoading}
                                                onClick={() =>
                                                    navigate(
                                                        `/transactions/${transaction.id}/edit`,
                                                        {
                                                            state: {
                                                                occurredAt: selectedDate,
                                                            },
                                                        }
                                                    )
                                                }
                                                type="button"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className={styles.inlineButtonDanger}
                                                disabled={isLoading || isMutating}
                                                onClick={() =>
                                                    setPendingDeleteTransactionId(transaction.id)
                                                }
                                                type="button"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {isLoading ? (
                            <div className={styles.loadingOverlay}>
                                <div className={styles.loadingState}>
                                    <span className={styles.loadingSpinner} />
                                    <p>Loading transactions for {selectedDateLabel}</p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </section>
            </section>

            {activeTransactionId ? (
                <EditTransactionPage transactionId={activeTransactionId} />
            ) : null}

            <ConfirmationDialog
                confirmLabel="Delete"
                description="This transaction will be removed from the selected day."
                isBusy={isMutating}
                isOpen={pendingDeleteTransactionId !== null}
                onCancel={() => setPendingDeleteTransactionId(null)}
                onConfirm={() => void handleDeleteTransaction()}
                title="Delete this transaction?"
            />
        </section>
    );
}

function formatDate(year: number, monthIndex: number, day: number) {
    return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatFilterLabel(value: (typeof transactionFilters)[number]): string {
    return value === 'ALL' ? 'All' : value === 'INCOME' ? 'Income' : 'Expense';
}

function formatLabel(value: string) {
    return value
        .split('_')
        .map((segment) => segment.charAt(0) + segment.slice(1).toLowerCase())
        .join(' ');
}

function formatMoney(value: number): string {
    const isNegative = value < 0;
    const absoluteValue = Math.abs(value);

    return `${isNegative ? '-' : ''}THB ${absoluteValue.toLocaleString()}`;
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

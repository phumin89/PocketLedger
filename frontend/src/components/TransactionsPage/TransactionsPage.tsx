import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionsStore } from '../../hooks/useTransactionsStore';
import styles from './TransactionsPage.module.scss';

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });

export function TransactionsPage() {
    const navigate = useNavigate();
    const { transactions, years, createTransactionForDate, deleteTransaction } =
        useTransactionsStore();

    const [selectedYear, setSelectedYear] = useState<number>(() => years[0] ?? 2026);
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
    const [selectedDay, setSelectedDay] = useState<number>(1);

    useEffect(() => {
        if (!years.includes(selectedYear) && years.length > 0) {
            setSelectedYear(years[0]);
        }
    }, [selectedYear, years]);

    const months = useMemo(() => {
        return Array.from({ length: 12 }, (_, monthIndex) => {
            const monthTransactions = transactions.filter((transaction) => {
                const date = new Date(transaction.occurredAt);

                return date.getUTCFullYear() === selectedYear && date.getUTCMonth() === monthIndex;
            });

            return {
                index: monthIndex,
                label: monthFormatter.format(new Date(Date.UTC(selectedYear, monthIndex, 1))),
                count: monthTransactions.length,
            };
        });
    }, [selectedYear, transactions]);

    useEffect(() => {
        const latestMonthWithData = [...months].reverse().find((month) => month.count > 0);

        if (latestMonthWithData && months[selectedMonth]?.count === 0) {
            setSelectedMonth(latestMonthWithData.index);
        }
    }, [months, selectedMonth]);

    const daysInMonth = useMemo(
        () => new Date(Date.UTC(selectedYear, selectedMonth + 1, 0)).getUTCDate(),
        [selectedMonth, selectedYear]
    );

    const days = useMemo(() => {
        return Array.from({ length: daysInMonth }, (_, offset) => {
            const dayNumber = offset + 1;
            const key = formatDate(selectedYear, selectedMonth, dayNumber);
            const dayTransactions = transactions.filter(
                (transaction) => transaction.occurredAt === key
            );

            return {
                dayNumber,
                key,
                count: dayTransactions.length,
            };
        });
    }, [daysInMonth, selectedMonth, selectedYear, transactions]);

    useEffect(() => {
        const latestDayWithData = [...days].reverse().find((day) => day.count > 0);

        if (latestDayWithData && days[selectedDay - 1]?.count === 0) {
            setSelectedDay(latestDayWithData.dayNumber);
            return;
        }

        if (selectedDay > daysInMonth) {
            setSelectedDay(1);
        }
    }, [days, daysInMonth, selectedDay]);

    const selectedDate = formatDate(selectedYear, selectedMonth, selectedDay);

    const selectedDayTransactions = useMemo(() => {
        return transactions.filter((transaction) => transaction.occurredAt === selectedDate);
    }, [selectedDate, transactions]);

    function handleCreateTransaction() {
        const created = createTransactionForDate(selectedDate);

        navigate(`/transactions/${created.id}/edit`);
    }

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <div>
                    <p className={styles.kicker}>Transactions</p>
                    <h1 className={styles.title}>Find transactions by date</h1>
                    <p className={styles.subtitle}>
                        Start with the year, narrow it down by month, then open the day you want to
                        review.
                    </p>
                </div>

                <label className={styles.yearPicker}>
                    <span>Year</span>
                    <select
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
                                key={month.label}
                                onClick={() => setSelectedMonth(month.index)}
                                type="button"
                            >
                                <span>{month.label}</span>
                                <small>{month.count}</small>
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
                        <span className={styles.helperText}>Pick a day to see the entries</span>
                    </div>

                    <div className={styles.daysGrid}>
                        {days.map((day) => (
                            <button
                                className={
                                    day.dayNumber === selectedDay
                                        ? styles.dayButtonActive
                                        : styles.dayButton
                                }
                                key={day.key}
                                onClick={() => setSelectedDay(day.dayNumber)}
                                type="button"
                            >
                                <strong>{day.dayNumber}</strong>
                                <small>
                                    {day.count} item{day.count === 1 ? '' : 's'}
                                </small>
                            </button>
                        ))}
                    </div>
                </section>

                <section className={styles.listCard}>
                    <div className={styles.listHeader}>
                        <div>
                            <p className={styles.sectionKicker}>Transactions</p>
                            <strong>{selectedDate}</strong>
                        </div>
                        <button
                            className={styles.addButton}
                            onClick={handleCreateTransaction}
                            type="button"
                        >
                            Add transaction
                        </button>
                    </div>

                    {selectedDayTransactions.length === 0 ? (
                        <div className={styles.emptyState}>
                            <h2>Nothing recorded for this day yet</h2>
                            <p>Create a sample transaction to start filling it in.</p>
                        </div>
                    ) : (
                        <div className={styles.transactionList}>
                            {selectedDayTransactions.map((transaction) => (
                                <article className={styles.transactionItem} key={transaction.id}>
                                    <div className={styles.transactionMain}>
                                        <div>
                                            <h2 className={styles.transactionTitle}>
                                                {transaction.title}
                                            </h2>
                                            <p className={styles.transactionMeta}>
                                                {transaction.category} · {transaction.account}
                                            </p>
                                        </div>
                                        <strong className={styles.transactionAmount}>
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
                                            onClick={() =>
                                                navigate(`/transactions/${transaction.id}/edit`)
                                            }
                                            type="button"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={styles.inlineButtonDanger}
                                            onClick={() => deleteTransaction(transaction.id)}
                                            type="button"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </section>
        </section>
    );
}

function formatDate(year: number, monthIndex: number, day: number) {
    return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

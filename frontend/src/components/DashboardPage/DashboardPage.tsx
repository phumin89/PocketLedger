import { useMemo } from 'react';
import { useTransactionsStore } from '../../hooks/useTransactionsStore';
import styles from './DashboardPage.module.scss';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
});

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });

export function DashboardPage() {
    const { transactions } = useTransactionsStore();

    const dashboard = useMemo(() => {
        const dates = transactions.map((transaction) => new Date(transaction.occurredAt));
        const latestDate = dates.sort((left, right) => right.getTime() - left.getTime())[0];
        const year = latestDate?.getUTCFullYear() ?? new Date().getUTCFullYear();
        const month = latestDate?.getUTCMonth() ?? new Date().getUTCMonth();

        const yearTransactions = transactions.filter((transaction) => {
            const date = new Date(transaction.occurredAt);

            return date.getUTCFullYear() === year;
        });

        const monthTransactions = yearTransactions.filter((transaction) => {
            const date = new Date(transaction.occurredAt);

            return date.getUTCMonth() === month;
        });

        const incomeYear = sumAmounts(
            yearTransactions.filter((transaction) => transaction.type === 'INCOME')
        );
        const expenseYear = sumAmounts(
            yearTransactions.filter((transaction) => transaction.type === 'EXPENSE')
        );
        const incomeMonth = sumAmounts(
            monthTransactions.filter((transaction) => transaction.type === 'INCOME')
        );
        const expenseMonth = sumAmounts(
            monthTransactions.filter((transaction) => transaction.type === 'EXPENSE')
        );

        const recentTransactions = [...transactions]
            .sort((left, right) => {
                return new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime();
            })
            .slice(0, 5);

        const expenseByCategory = aggregateByCategory(
            yearTransactions.filter((transaction) => transaction.type === 'EXPENSE')
        ).slice(0, 5);

        const monthlyTrend = Array.from({ length: 4 }, (_, offset) => {
            const trendMonth = month - (3 - offset);
            const trendDate = new Date(Date.UTC(year, trendMonth, 1));
            const trendLabel = monthFormatter.format(trendDate);
            const trendTransactions = transactions.filter((transaction) => {
                const date = new Date(transaction.occurredAt);

                return (
                    date.getUTCFullYear() === trendDate.getUTCFullYear() &&
                    date.getUTCMonth() === trendDate.getUTCMonth()
                );
            });

            return {
                label: trendLabel,
                income: sumAmounts(
                    trendTransactions.filter((transaction) => transaction.type === 'INCOME')
                ),
                expense: sumAmounts(
                    trendTransactions.filter((transaction) => transaction.type === 'EXPENSE')
                ),
            };
        });

        return {
            year,
            monthLabel: monthFormatter.format(new Date(Date.UTC(year, month, 1))),
            stats: [
                {
                    label: 'Balance this month',
                    value: currencyFormatter.format(incomeMonth - expenseMonth),
                },
                {
                    label: 'Income this year',
                    value: currencyFormatter.format(incomeYear),
                },
                {
                    label: 'Expense this year',
                    value: currencyFormatter.format(expenseYear),
                },
                {
                    label: 'Transactions this month',
                    value: monthTransactions.length.toString(),
                },
            ],
            recentTransactions,
            expenseByCategory,
            monthlyTrend,
        };
    }, [transactions]);

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <div>
                    <p className={styles.kicker}>Dashboard</p>
                    <h1 className={styles.title}>This month at a glance</h1>
                    <p className={styles.subtitle}>
                        A quick read on recent activity, bigger spending buckets, and how the last
                        few months are trending.
                    </p>
                </div>

                <div className={styles.periodBadge}>
                    {dashboard.monthLabel} {dashboard.year}
                </div>
            </header>

            <section className={styles.statsGrid}>
                {dashboard.stats.map((stat) => (
                    <article className={styles.statCard} key={stat.label}>
                        <p className={styles.statLabel}>{stat.label}</p>
                        <h2 className={styles.statValue}>{stat.value}</h2>
                    </article>
                ))}
            </section>

            <section className={styles.mainGrid}>
                <article className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <p className={styles.panelKicker}>Recent activity</p>
                        <strong>Most recent entries</strong>
                    </div>
                    <div className={styles.transactionList}>
                        {dashboard.recentTransactions.map((transaction) => (
                            <div className={styles.transactionRow} key={transaction.id}>
                                <div>
                                    <h3 className={styles.transactionTitle}>{transaction.title}</h3>
                                    <p className={styles.transactionMeta}>
                                        {transaction.occurredAt} · {transaction.category}
                                    </p>
                                </div>
                                <strong className={styles.transactionAmount}>
                                    {transaction.type === 'INCOME' ? '+' : '-'}
                                    {currencyFormatter.format(Number(transaction.amount))}
                                </strong>
                            </div>
                        ))}
                    </div>
                </article>

                <article className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <p className={styles.panelKicker}>Spending mix</p>
                        <strong>Largest expense categories</strong>
                    </div>
                    <div className={styles.categoryList}>
                        {dashboard.expenseByCategory.map((category) => (
                            <div className={styles.categoryRow} key={category.name}>
                                <div className={styles.categoryCopy}>
                                    <span>{category.name}</span>
                                    <strong>{currencyFormatter.format(category.total)}</strong>
                                </div>
                                <div className={styles.categoryTrack}>
                                    <div
                                        className={styles.categoryFill}
                                        style={{ width: `${category.share}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </article>

                <article className={styles.panelWide}>
                    <div className={styles.panelHeader}>
                        <p className={styles.panelKicker}>Trend</p>
                        <strong>Last four months</strong>
                    </div>
                    <div className={styles.trendGrid}>
                        {dashboard.monthlyTrend.map((item) => (
                            <div className={styles.trendCard} key={item.label}>
                                <p className={styles.trendLabel}>{item.label}</p>
                                <div className={styles.trendBars}>
                                    <div
                                        className={styles.trendIncome}
                                        style={{ width: `${Math.min(item.income / 1000, 100)}%` }}
                                    />
                                    <div
                                        className={styles.trendExpense}
                                        style={{ width: `${Math.min(item.expense / 1000, 100)}%` }}
                                    />
                                </div>
                                <div className={styles.trendMeta}>
                                    <span>{currencyFormatter.format(item.income)}</span>
                                    <span>{currencyFormatter.format(item.expense)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </article>
            </section>
        </section>
    );
}

function sumAmounts(items: Array<{ amount: string }>) {
    return items.reduce((total, item) => total + Number(item.amount), 0);
}

function aggregateByCategory(items: Array<{ category: string; amount: string }>) {
    const totals = new Map<string, number>();
    const overall = sumAmounts(items);

    for (const item of items) {
        totals.set(item.category, (totals.get(item.category) ?? 0) + Number(item.amount));
    }

    return [...totals.entries()]
        .map(([name, total]) => ({
            name,
            total,
            share: overall > 0 ? (total / overall) * 100 : 0,
        }))
        .sort((left, right) => right.total - left.total);
}

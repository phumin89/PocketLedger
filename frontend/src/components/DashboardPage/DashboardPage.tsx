import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTransactionsStore } from '../../hooks/useTransactionsStore';
import { useDashboardViewModel } from '../../hooks/useDashboardViewModel';
import styles from './DashboardPage.module.scss';
import type { DashboardPageProps } from './DashboardPageProps';

const monthLabels = Array.from({ length: 12 }, (_, month) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
        new Date(Date.UTC(2026, month, 1))
    );
});

export function DashboardPage({ firstName }: DashboardPageProps) {
    const { transactions } = useTransactionsStore();
    const { dashboard, periods, selectedPeriod, selectedPeriodKey, setSelectedPeriodKey } =
        useDashboardViewModel(transactions);
    const [isPeriodPickerOpen, setIsPeriodPickerOpen] = useState<boolean>(false);
    const [pickerView, setPickerView] = useState<'month' | 'year'>('month');
    const [pickerYear, setPickerYear] = useState<number>(selectedPeriod?.year ?? 2026);
    const periodPickerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (selectedPeriod) {
            setPickerYear(selectedPeriod.year);
        }
    }, [selectedPeriod]);

    useEffect(() => {
        if (isPeriodPickerOpen) {
            setPickerView('month');
        }
    }, [isPeriodPickerOpen]);

    useEffect(() => {
        if (!isPeriodPickerOpen) {
            return;
        }

        function handlePointerDown(event: MouseEvent) {
            if (
                periodPickerRef.current &&
                !periodPickerRef.current.contains(event.target as Node)
            ) {
                setIsPeriodPickerOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsPeriodPickerOpen(false);
            }
        }

        window.addEventListener('mousedown', handlePointerDown);
        window.addEventListener('keydown', handleEscape);

        return () => {
            window.removeEventListener('mousedown', handlePointerDown);
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isPeriodPickerOpen]);

    const selectedPeriodLabel = useMemo(() => {
        if (selectedPeriod) {
            return dashboard.periodLabel;
        }

        return periods[0]?.label ?? 'Select month';
    }, [dashboard.periodLabel, periods, selectedPeriod]);
    const yearPageStart = useMemo(() => {
        return Math.floor(pickerYear / 12) * 12;
    }, [pickerYear]);
    const yearPageLabel = useMemo(() => {
        return `${yearPageStart}-${yearPageStart + 11}`;
    }, [yearPageStart]);
    const yearOptions = useMemo(() => {
        return Array.from({ length: 12 }, (_, index) => yearPageStart + index);
    }, [yearPageStart]);

    if (dashboard.isEmpty) {
        return (
            <section className={styles.page}>
                <section className={styles.emptyState}>
                    <p className={styles.kicker}>Dashboard</p>
                    <h1 className={styles.title}>Nothing to read yet</h1>
                    <p className={styles.subtitle}>
                        Start by recording a few transactions and this space will turn them into a
                        cleaner read on momentum, categories, and recent activity.
                    </p>
                    <Link className={styles.emptyAction} to="/transactions">
                        Open transactions
                    </Link>
                </section>
            </section>
        );
    }

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <div>
                    <p className={styles.kicker}>Dashboard</p>
                    <h1 className={styles.title}>
                        {firstName
                            ? `${firstName}, here is how this month is moving`
                            : 'Here is how this month is moving'}
                    </h1>
                    <p className={styles.subtitle}>
                        A clean read on inflow, outflow, spending mix, and the latest captured
                        entries.
                    </p>
                </div>

                <div
                    className={styles.periodPicker}
                    aria-label="Dashboard period picker"
                    ref={periodPickerRef}
                >
                    <button
                        aria-expanded={isPeriodPickerOpen}
                        aria-haspopup="dialog"
                        className={styles.periodTrigger}
                        onClick={() => setIsPeriodPickerOpen((current) => !current)}
                        type="button"
                    >
                        <span className={styles.periodTriggerValue}>{selectedPeriodLabel}</span>
                        <span aria-hidden="true" className={styles.periodTriggerIcon}>
                            <svg viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M6 3.5V6"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                />
                                <path
                                    d="M14 3.5V6"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                />
                                <path
                                    d="M4.5 8H15.5"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                />
                                <rect
                                    x="3.25"
                                    y="4.75"
                                    width="13.5"
                                    height="12"
                                    rx="2.25"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />
                                <path
                                    d="M7 11.25H10.25"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                />
                                <path
                                    d="M5 13.25H8.25"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                />
                            </svg>
                        </span>
                    </button>

                    {isPeriodPickerOpen ? (
                        <div className={styles.periodPopover} role="dialog" aria-label="Select month">
                            <div className={styles.periodPopoverHeader}>
                                <button
                                    className={styles.periodYearButton}
                                    aria-label="Previous year"
                                    onClick={() =>
                                        setPickerYear((current) =>
                                            pickerView === 'year' ? current - 12 : current - 1
                                        )
                                    }
                                    type="button"
                                >
                                    <svg viewBox="0 0 20 20" fill="none">
                                        <path
                                            d="M11.75 5.5L7.25 10L11.75 14.5"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.8"
                                        />
                                    </svg>
                                </button>
                                <button
                                    className={styles.periodYearValue}
                                    onClick={() =>
                                        setPickerView((current) =>
                                            current === 'month' ? 'year' : 'month'
                                        )
                                    }
                                    type="button"
                                >
                                    {pickerView === 'year' ? yearPageLabel : pickerYear}
                                </button>
                                <button
                                    className={styles.periodYearButton}
                                    aria-label="Next year"
                                    onClick={() =>
                                        setPickerYear((current) =>
                                            pickerView === 'year' ? current + 12 : current + 1
                                        )
                                    }
                                    type="button"
                                >
                                    <svg viewBox="0 0 20 20" fill="none">
                                        <path
                                            d="M8.25 5.5L12.75 10L8.25 14.5"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.8"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {pickerView === 'month' ? (
                                <div className={styles.periodMonthGrid}>
                                    {monthLabels.map((label, monthIndex) => {
                                        const periodKey = formatPeriodKey(pickerYear, monthIndex);
                                        const isActive = selectedPeriodKey === periodKey;

                                        return (
                                            <button
                                                className={
                                                    isActive
                                                        ? styles.periodMonthButtonActive
                                                        : styles.periodMonthButton
                                                }
                                                key={periodKey}
                                                onClick={() => {
                                                    setSelectedPeriodKey(periodKey);
                                                    setIsPeriodPickerOpen(false);
                                                }}
                                                type="button"
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className={styles.periodYearGrid}>
                                    {yearOptions.map((year) => {
                                        const isActive = selectedPeriod?.year === year;

                                        return (
                                            <button
                                                className={
                                                    isActive
                                                        ? styles.periodYearChipActive
                                                        : styles.periodYearChip
                                                }
                                                key={year}
                                                onClick={() => {
                                                    setPickerYear(year);
                                                    setPickerView('month');
                                                }}
                                                type="button"
                                            >
                                                {year}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </header>

            <section className={styles.heroGrid}>
                <article className={styles.heroPanel}>
                    <div>
                        <p className={styles.sectionLabel}>Net this month</p>
                        <h2 className={styles.heroValue}>{dashboard.heroValue}</h2>
                        <p className={styles.heroCopy}>{dashboard.heroCopy}</p>
                    </div>

                    <div className={styles.heroFacts}>
                        {dashboard.heroFacts.map((fact) => (
                            <div className={styles.heroFact} key={fact.label}>
                                <span>{fact.label}</span>
                                <strong>{fact.value}</strong>
                            </div>
                        ))}
                    </div>
                </article>

                <div className={styles.metricColumn}>
                    {dashboard.stats.map((stat) => (
                        <article className={styles.metricCard} key={stat.label}>
                            <p className={styles.metricLabel}>{stat.label}</p>
                            <h2 className={styles.metricValue}>{stat.value}</h2>
                            <p className={styles.metricHint}>{stat.hint}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className={styles.contentGrid}>
                <article className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <div>
                            <p className={styles.sectionLabel}>Trend</p>
                            <h2 className={styles.panelTitle}>Last 6 months</h2>
                        </div>
                    </div>

                    <div className={styles.trendList}>
                        {dashboard.monthlyTrend.map((item) => (
                            <div className={styles.trendRow} key={item.label}>
                                <div className={styles.trendTop}>
                                    <strong>{item.label}</strong>
                                    <span>{item.netLabel}</span>
                                </div>
                                <div className={styles.trendTracks}>
                                    <div className={styles.trendTrack}>
                                        <div
                                            className={styles.trendIncomeFill}
                                            style={{ width: `${item.incomeWidth}%` }}
                                        />
                                    </div>
                                    <div className={styles.trendTrack}>
                                        <div
                                            className={styles.trendExpenseFill}
                                            style={{ width: `${item.expenseWidth}%` }}
                                        />
                                    </div>
                                </div>
                                <div className={styles.trendMeta}>
                                    <span>In {item.incomeLabel}</span>
                                    <span>Out {item.expenseLabel}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </article>

                <article className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <div>
                            <p className={styles.sectionLabel}>Expense mix</p>
                            <h2 className={styles.panelTitle}>Largest buckets</h2>
                        </div>
                    </div>

                    {dashboard.expenseCategories.length > 0 ? (
                        <div className={styles.categoryList}>
                            {dashboard.expenseCategories.map((category) => (
                                <div className={styles.categoryRow} key={category.name}>
                                    <div className={styles.categoryCopy}>
                                        <strong>{category.name}</strong>
                                        <span>{category.total}</span>
                                    </div>
                                    <div className={styles.categoryTrack}>
                                        <div
                                            className={styles.categoryFill}
                                            style={{ width: `${category.share}%` }}
                                        />
                                    </div>
                                    <span className={styles.categoryShare}>{category.share}%</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.emptyPanelCopy}>
                            No expense categories have been captured for this month yet.
                        </p>
                    )}
                </article>

                <article className={styles.panelWide}>
                    <div className={styles.panelHeader}>
                        <div>
                            <p className={styles.sectionLabel}>Recent activity</p>
                            <h2 className={styles.panelTitle}>Latest captured entries</h2>
                        </div>
                    </div>

                    {dashboard.recentTransactions.length > 0 ? (
                        <div className={styles.activityList}>
                            {dashboard.recentTransactions.map((transaction) => (
                                <div className={styles.activityRow} key={transaction.id}>
                                    <div className={styles.activityCopy}>
                                        <div className={styles.activityTitleRow}>
                                            <h3 className={styles.activityTitle}>
                                                {transaction.title}
                                            </h3>
                                            <strong
                                                className={
                                                    transaction.tone === 'income'
                                                        ? styles.activityAmountIncome
                                                        : styles.activityAmountExpense
                                                }
                                            >
                                                {transaction.amountLabel}
                                            </strong>
                                        </div>
                                        <div className={styles.activityMeta}>
                                            <span
                                                className={
                                                    transaction.tone === 'income'
                                                        ? styles.activityBadgeIncome
                                                        : styles.activityBadgeExpense
                                                }
                                            >
                                                {transaction.typeLabel}
                                            </span>
                                            <span>{transaction.category}</span>
                                            <span>{transaction.dateLabel}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.emptyPanelCopy}>
                            No transactions were captured for this month.
                        </p>
                    )}
                </article>
            </section>
        </section>
    );
}

function formatPeriodKey(year: number, month: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}`;
}

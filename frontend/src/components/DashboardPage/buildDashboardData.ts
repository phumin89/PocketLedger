import type { TransactionRecord } from '../../content/TransactionRecord';
import type {
    DashboardCategoryItem,
    DashboardData,
    DashboardFact,
    DashboardPeriodOption,
    DashboardRecentTransaction,
    DashboardStat,
    DashboardTrendItem,
} from './DashboardData';

type ParsedTransactionRecord = TransactionRecord & {
    amountValue: number;
    date: Date;
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
});

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
const periodFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
});
const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
});

export function buildDashboardPeriods(transactions: TransactionRecord[]): DashboardPeriodOption[] {
    const parsedTransactions = transactions.map(parseTransactionRecord);
    const periodMap = new Map<string, DashboardPeriodOption>();

    for (const transaction of parsedTransactions) {
        const year = transaction.date.getUTCFullYear();
        const month = transaction.date.getUTCMonth();
        const key = `${year}-${String(month + 1).padStart(2, '0')}`;

        if (!periodMap.has(key)) {
            periodMap.set(key, {
                key,
                label: periodFormatter.format(new Date(Date.UTC(year, month, 1))),
                year,
                month,
            });
        }
    }

    return [...periodMap.values()].sort((left, right) => {
        if (left.year !== right.year) {
            return right.year - left.year;
        }

        return right.month - left.month;
    });
}

export function buildDashboardData(
    transactions: TransactionRecord[],
    activePeriodKey?: string
): DashboardData {
    const periods = buildDashboardPeriods(transactions);

    if (periods.length === 0) {
        return {
            isEmpty: true,
            periodLabel: periodFormatter.format(new Date()),
            heroValue: currencyFormatter.format(0),
            heroCopy: 'No transaction activity has been captured yet.',
            heroFacts: [],
            stats: [],
            monthlyTrend: [],
            expenseCategories: [],
            recentTransactions: [],
        };
    }

    const parsedTransactions = transactions
        .map(parseTransactionRecord)
        .sort((left, right) => right.date.getTime() - left.date.getTime());
    const selectedPeriod =
        periods.find((period) => period.key === activePeriodKey) ??
        parseDashboardPeriod(activePeriodKey) ??
        periods[0];
    const yearTransactions = parsedTransactions.filter((transaction) => {
        return transaction.date.getUTCFullYear() === selectedPeriod.year;
    });
    const monthTransactions = yearTransactions.filter((transaction) => {
        return transaction.date.getUTCMonth() === selectedPeriod.month;
    });
    const monthIncome = sumAmounts(monthTransactions, 'INCOME');
    const monthExpense = sumAmounts(monthTransactions, 'EXPENSE');
    const monthNet = monthIncome - monthExpense;
    const yearIncome = sumAmounts(yearTransactions, 'INCOME');
    const yearExpense = sumAmounts(yearTransactions, 'EXPENSE');
    const yearNet = yearIncome - yearExpense;
    const savingsBucket = yearTransactions
        .filter((transaction) => transaction.category === 'Savings')
        .reduce((total, transaction) => total + transaction.amountValue, 0);
    const activeCategoryCount = new Set(
        monthTransactions.map((transaction) => transaction.category)
    ).size;
    const latestIncome = monthTransactions.find((transaction) => transaction.type === 'INCOME');
    const largestExpense = [...monthTransactions]
        .filter((transaction) => transaction.type === 'EXPENSE')
        .sort((left, right) => right.amountValue - left.amountValue)[0];

    const heroFacts: DashboardFact[] = [
        {
            label: 'Largest spend',
            value: largestExpense
                ? `${largestExpense.title} · ${formatCurrency(largestExpense.amountValue)}`
                : 'No expenses recorded',
        },
        {
            label: 'Latest income',
            value: latestIncome
                ? `${latestIncome.title} · ${formatCurrency(latestIncome.amountValue)}`
                : 'No income recorded',
        },
        {
            label: 'Active categories',
            value: `${activeCategoryCount} this month`,
        },
    ];

    const stats: DashboardStat[] = [
        {
            label: 'Inflow this month',
            value: formatCurrency(monthIncome),
            hint: `${monthTransactions.filter((transaction) => transaction.type === 'INCOME').length} income entries`,
        },
        {
            label: 'Outflow this month',
            value: formatCurrency(monthExpense),
            hint: `${monthTransactions.filter((transaction) => transaction.type === 'EXPENSE').length} expense entries`,
        },
        {
            label: 'Net this year',
            value: formatCurrency(yearNet),
            hint: `${selectedPeriod.year} year to date`,
        },
        {
            label: 'Savings bucket',
            value: formatCurrency(savingsBucket),
            hint: 'Captured as Savings',
        },
    ];

    return {
        isEmpty: false,
        periodLabel: selectedPeriod.label,
        heroValue: formatCurrency(monthNet),
        heroCopy: `${formatCurrency(monthIncome)} in and ${formatCurrency(monthExpense)} out during ${selectedPeriod.label}.`,
        heroFacts,
        stats,
        monthlyTrend: buildMonthlyTrend(parsedTransactions, selectedPeriod.year, selectedPeriod.month),
        expenseCategories: aggregateExpenseCategories(monthTransactions).slice(0, 5),
        recentTransactions: monthTransactions
            .slice(0, 6)
            .map<DashboardRecentTransaction>((transaction) => {
                return {
                    id: transaction.id,
                    title: transaction.title,
                    category: transaction.category,
                    dateLabel: shortDateFormatter.format(transaction.date),
                    amountLabel: `${transaction.type === 'INCOME' ? '+' : '-'}${formatCurrency(
                        transaction.amountValue
                    )}`,
                    typeLabel: transaction.type === 'INCOME' ? 'Income' : 'Expense',
                    tone: transaction.type === 'INCOME' ? 'income' : 'expense',
                };
            }),
    };
}

function buildMonthlyTrend(
    transactions: ParsedTransactionRecord[],
    activeYear: number,
    activeMonth: number
): DashboardTrendItem[] {
    const monthWindows = Array.from({ length: 6 }, (_, index) => {
        return new Date(Date.UTC(activeYear, activeMonth - (5 - index), 1));
    });

    const trendTotals = monthWindows.map((monthDate) => {
        const monthTransactions = transactions.filter((transaction) => {
            return (
                transaction.date.getUTCFullYear() === monthDate.getUTCFullYear() &&
                transaction.date.getUTCMonth() === monthDate.getUTCMonth()
            );
        });

        return {
            label: monthFormatter.format(monthDate),
            income: sumAmounts(monthTransactions, 'INCOME'),
            expense: sumAmounts(monthTransactions, 'EXPENSE'),
        };
    });

    const maxAmount = Math.max(1, ...trendTotals.flatMap((item) => [item.income, item.expense]));

    return trendTotals.map<DashboardTrendItem>((item) => {
        return {
            label: item.label,
            incomeLabel: formatCurrency(item.income),
            expenseLabel: formatCurrency(item.expense),
            netLabel: formatCurrency(item.income - item.expense),
            incomeWidth: (item.income / maxAmount) * 100,
            expenseWidth: (item.expense / maxAmount) * 100,
        };
    });
}

function aggregateExpenseCategories(
    transactions: ParsedTransactionRecord[]
): DashboardCategoryItem[] {
    const expenseTransactions = transactions.filter((transaction) => transaction.type === 'EXPENSE');
    const totalExpense = expenseTransactions.reduce((total, transaction) => {
        return total + transaction.amountValue;
    }, 0);
    const categoryTotals = new Map<string, number>();

    for (const transaction of expenseTransactions) {
        categoryTotals.set(
            transaction.category,
            (categoryTotals.get(transaction.category) ?? 0) + transaction.amountValue
        );
    }

    return [...categoryTotals.entries()]
        .map(([name, total]) => {
            return {
                name,
                total: formatCurrency(total),
                share: totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0,
            };
        })
        .sort((left, right) => right.share - left.share);
}

function parseTransactionRecord(transaction: TransactionRecord): ParsedTransactionRecord {
    return {
        ...transaction,
        amountValue: Number(transaction.amount),
        date: new Date(`${transaction.occurredAt}T00:00:00.000Z`),
    };
}

function sumAmounts(
    transactions: ParsedTransactionRecord[],
    type: 'INCOME' | 'EXPENSE'
): number {
    return transactions
        .filter((transaction) => transaction.type === type)
        .reduce((total, transaction) => total + transaction.amountValue, 0);
}

function formatCurrency(amount: number): string {
    return currencyFormatter.format(amount);
}

function parseDashboardPeriod(
    periodKey: string | undefined
): DashboardPeriodOption | null {
    if (!periodKey || !/^\d{4}-\d{2}$/.test(periodKey)) {
        return null;
    }

    const [yearPart, monthPart] = periodKey.split('-');
    const year = Number(yearPart);
    const month = Number(monthPart) - 1;

    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 0 || month > 11) {
        return null;
    }

    return {
        key: periodKey,
        label: periodFormatter.format(new Date(Date.UTC(year, month, 1))),
        year,
        month,
    };
}

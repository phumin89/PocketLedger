export type DashboardFact = {
    label: string;
    value: string;
};

export type DashboardPeriodOption = {
    key: string;
    label: string;
    year: number;
    month: number;
};

export type DashboardStat = {
    label: string;
    value: string;
    hint: string;
};

export type DashboardTrendItem = {
    label: string;
    incomeLabel: string;
    expenseLabel: string;
    netLabel: string;
    incomeWidth: number;
    expenseWidth: number;
};

export type DashboardCategoryItem = {
    name: string;
    total: string;
    share: number;
};

export type DashboardRecentTransaction = {
    id: string;
    title: string;
    category: string;
    dateLabel: string;
    amountLabel: string;
    typeLabel: string;
    tone: 'income' | 'expense';
};

export type DashboardData = {
    isEmpty: boolean;
    periodLabel: string;
    heroValue: string;
    heroCopy: string;
    heroFacts: DashboardFact[];
    stats: DashboardStat[];
    monthlyTrend: DashboardTrendItem[];
    expenseCategories: DashboardCategoryItem[];
    recentTransactions: DashboardRecentTransaction[];
};

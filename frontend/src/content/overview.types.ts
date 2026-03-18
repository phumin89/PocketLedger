export type OverviewStat = {
    label: string;
    value: string;
    change: string;
    tone?: 'neutral' | 'positive';
};

export type OverviewTrendPoint = {
    month: string;
    income: number;
    expense: number;
};

export type OverviewCategory = {
    name: string;
    amount: string;
    share: number;
};

export type OverviewHighlight = {
    label: string;
    value: string;
};

export type OverviewData = {
    title: string;
    subtitle: string;
    year: string;
    profile: {
        firstName: string;
        lastName: string;
        occupation: string;
        status: string;
    };
    stats: OverviewStat[];
    monthlyAverage: string;
    annualIncome: string;
    annualExpense: string;
    savingsRate: string;
    trend: OverviewTrendPoint[];
    categories: OverviewCategory[];
    highlights: OverviewHighlight[];
};

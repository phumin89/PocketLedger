import type { OverviewCategory } from './OverviewCategory';
import type { OverviewHighlight } from './OverviewHighlight';
import type { OverviewStat } from './OverviewStat';
import type { OverviewTrendPoint } from './OverviewTrendPoint';

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

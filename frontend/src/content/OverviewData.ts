import type { OverviewCategory } from './OverviewCategory.ts';
import type { OverviewHighlight } from './OverviewHighlight.ts';
import type { OverviewStat } from './OverviewStat.ts';
import type { OverviewTrendPoint } from './OverviewTrendPoint.ts';

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

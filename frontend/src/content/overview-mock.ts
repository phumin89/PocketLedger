import type { OverviewData } from './OverviewData';

export const overviewMock: OverviewData = {
    title: 'Overview',
    subtitle: 'Mocked summary for a clean finance dashboard layout.',
    year: '2026',
    profile: {
        firstName: 'Narin',
        lastName: 'Srisawat',
        occupation: 'Product Designer',
        status: 'Mock profile',
    },
    stats: [
        {
            label: 'Annual income',
            value: 'THB 1,260,000',
            change: '+8.4% vs last year',
            tone: 'positive',
        },
        {
            label: 'Annual expense',
            value: 'THB 684,000',
            change: '+3.1% vs last year',
        },
        {
            label: 'Monthly average',
            value: 'THB 105,000',
            change: 'Based on 12 months',
        },
        {
            label: 'Net this month',
            value: 'THB 48,300',
            change: '+12.0% vs February',
            tone: 'positive',
        },
    ],
    monthlyAverage: 'THB 105,000',
    annualIncome: 'THB 1,260,000',
    annualExpense: 'THB 684,000',
    savingsRate: '45.7%',
    trend: [
        { month: 'Jan', income: 88, expense: 46 },
        { month: 'Feb', income: 82, expense: 44 },
        { month: 'Mar', income: 96, expense: 48 },
        { month: 'Apr', income: 92, expense: 51 },
        { month: 'May', income: 100, expense: 56 },
        { month: 'Jun', income: 94, expense: 49 },
    ],
    categories: [
        { name: 'Living', amount: 'THB 24,000', share: 38 },
        { name: 'Food', amount: 'THB 15,400', share: 24 },
        { name: 'Transport', amount: 'THB 9,600', share: 15 },
        { name: 'Shopping', amount: 'THB 7,300', share: 11 },
        { name: 'Other', amount: 'THB 6,900', share: 12 },
    ],
    highlights: [
        {
            label: 'Full name',
            value: 'Narin Srisawat',
        },
        {
            label: 'Primary income source',
            value: 'Salary + freelance retainer',
        },
        {
            label: 'Best month',
            value: 'May 2026',
        },
        {
            label: 'Savings rate',
            value: '45.7%',
        },
    ],
};

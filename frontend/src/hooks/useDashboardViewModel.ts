import { useEffect, useMemo, useState } from 'react';
import type { TransactionRecord } from '../content/TransactionRecord';
import { buildDashboardData, buildDashboardPeriods } from '../components/DashboardPage/buildDashboardData';

export function useDashboardViewModel(transactions: TransactionRecord[]) {
    const periods = useMemo(() => {
        return buildDashboardPeriods(transactions);
    }, [transactions]);
    const [selectedPeriodKey, setSelectedPeriodKey] = useState<string | null>(null);

    useEffect(() => {
        if (periods.length === 0) {
            setSelectedPeriodKey(null);
            return;
        }

        setSelectedPeriodKey((current) => current ?? periods[0].key);
    }, [periods]);

    const dashboard = useMemo(() => {
        return buildDashboardData(transactions, selectedPeriodKey ?? undefined);
    }, [selectedPeriodKey, transactions]);
    const selectedPeriod = useMemo(() => {
        if (!selectedPeriodKey || !/^\d{4}-\d{2}$/.test(selectedPeriodKey)) {
            return null;
        }

        const [yearPart, monthPart] = selectedPeriodKey.split('-');

        return {
            year: Number(yearPart),
            month: Number(monthPart) - 1,
        };
    }, [selectedPeriodKey]);
    return {
        dashboard,
        periods,
        selectedPeriod,
        selectedPeriodKey,
        setSelectedPeriodKey,
    };
}

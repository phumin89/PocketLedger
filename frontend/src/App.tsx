import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import styles from './App.module.scss';
import { Navbar } from './components/Navbar/Navbar';
import { OverviewPage } from './components/OverviewPage/OverviewPage';
import { navItems } from './content/home-content';
import { overviewMock } from './content/overview-mock';
import { TransactionsStoreProvider } from './hooks/useTransactionsStore';

const DashboardPage = lazy(async () => {
    const module = await import('./components/DashboardPage/DashboardPage');

    return { default: module.DashboardPage };
});

const TransactionsPage = lazy(async () => {
    const module = await import('./components/TransactionsPage/TransactionsPage');

    return { default: module.TransactionsPage };
});

const EditTransactionPage = lazy(async () => {
    const module = await import('./components/EditTransactionPage/EditTransactionPage');

    return { default: module.EditTransactionPage };
});

export default function App() {
    return (
        <main className={styles.page}>
            <TransactionsStoreProvider>
                <div className={styles.shell}>
                    <Navbar items={navItems} />
                    <section className={styles.canvas}>
                        <Suspense fallback={<RouteLoadingState />}>
                            <Routes>
                                <Route path="/" element={<OverviewPage data={overviewMock} />} />
                                <Route path="/overview" element={<Navigate replace to="/" />} />
                                <Route path="/dashboard" element={<DashboardPage />} />
                                <Route path="/transactions" element={<TransactionsPage />} />
                                <Route
                                    path="/transactions/:transactionId/edit"
                                    element={<EditTransactionPage />}
                                />
                                <Route
                                    path="/reports"
                                    element={
                                        <section className={styles.placeholder}>
                                            <p className={styles.placeholderKicker}>Reports</p>
                                            <h1 className={styles.placeholderTitle}>Coming next</h1>
                                            <p className={styles.placeholderText}>
                                                This section will hold longer-term summaries and
                                                cashflow reports.
                                            </p>
                                        </section>
                                    }
                                />
                            </Routes>
                        </Suspense>
                    </section>
                </div>
            </TransactionsStoreProvider>
        </main>
    );
}

function RouteLoadingState() {
    return (
        <section className={styles.placeholder}>
            <p className={styles.placeholderKicker}>Loading</p>
            <h1 className={styles.placeholderTitle}>Preparing page</h1>
            <p className={styles.placeholderText}>Loading the next workspace view.</p>
        </section>
    );
}

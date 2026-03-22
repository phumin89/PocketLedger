import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import styles from './App.module.scss';
import { LoginPage } from './components/LoginPage/LoginPage';
import { Navbar } from './components/Navbar/Navbar';
import { OverviewPage } from './components/OverviewPage/OverviewPage';
import { buildOverviewData } from './components/OverviewPage/buildOverviewData';
import { navItems } from './content/home-content';
import { overviewMock } from './content/overview-mock';
import { useCurrentUser } from './hooks/useCurrentUser';
import { TransactionsStoreProvider } from './hooks/useTransactionsStore';

const DashboardPage = lazy(async () => {
    const module = await import('./components/DashboardPage/DashboardPage');

    return { default: module.DashboardPage };
});

const TransactionsPage = lazy(async () => {
    const module = await import('./components/TransactionsPage/TransactionsPage');

    return { default: module.TransactionsPage };
});

export default function App() {
    const {
        currentUser,
        error: currentUserError,
        isAuthenticated,
        isLoading: isCurrentUserLoading,
        refreshCurrentUser,
    } = useCurrentUser();
    const overviewData = buildOverviewData(
        overviewMock,
        currentUser,
        currentUserError,
        isCurrentUserLoading
    );

    if (isCurrentUserLoading) {
        return (
            <main className={styles.page}>
                <section className={styles.placeholder}>
                    <p className={styles.placeholderKicker}>Loading session</p>
                    <h1 className={styles.placeholderTitle}>Checking your account</h1>
                    <p className={styles.placeholderText}>
                        Pocket ledger is validating the active session.
                    </p>
                </section>
            </main>
        );
    }

    if (!isAuthenticated) {
        return (
            <main className={styles.page}>
                <Suspense fallback={<RouteLoadingState />}>
                    <Routes>
                        <Route
                            path="/login"
                            element={<LoginPage onLoginSuccess={refreshCurrentUser} />}
                        />
                        <Route path="*" element={<Navigate replace to="/login" />} />
                    </Routes>
                </Suspense>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <TransactionsStoreProvider>
                <div className={styles.shell}>
                    <Navbar items={navItems} />
                    <section className={styles.canvas}>
                        <Suspense fallback={<RouteLoadingState />}>
                            <Routes>
                                <Route path="/" element={<OverviewPage data={overviewData} />} />
                                <Route path="/login" element={<Navigate replace to="/" />} />
                                <Route path="/overview" element={<Navigate replace to="/" />} />
                                <Route
                                    path="/dashboard"
                                    element={<DashboardPage firstName={currentUser?.firstName} />}
                                />
                                <Route path="/transactions/*" element={<TransactionsPage />} />
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

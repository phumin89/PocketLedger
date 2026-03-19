import styles from './OverviewPage.module.scss';
import type { OverviewPageProps } from './OverviewPageProps.ts';

export function OverviewPage({ data }: OverviewPageProps) {
    return (
        <section className={styles.page} id="overview">
            <header className={styles.header}>
                <div>
                    <p className={styles.kicker}>{data.year} overview</p>
                    <h1 className={styles.title}>{data.title}</h1>
                    <p className={styles.subtitle}>{data.subtitle}</p>
                </div>
            </header>

            <section className={styles.statsGrid}>
                {data.stats.map((stat) => (
                    <article className={styles.statCard} key={stat.label}>
                        <p className={styles.statLabel}>{stat.label}</p>
                        <h2 className={styles.statValue}>{stat.value}</h2>
                        <p
                            className={
                                stat.tone === 'positive'
                                    ? styles.statChangePositive
                                    : styles.statChange
                            }
                        >
                            {stat.change}
                        </p>
                    </article>
                ))}
            </section>

            <section className={styles.mainGrid}>
                <article className={styles.profileCard}>
                    <div className={styles.profileHeader}>
                        <div className={styles.avatar}>
                            {data.profile.firstName.slice(0, 1)}
                            {data.profile.lastName.slice(0, 1)}
                        </div>
                        <div>
                            <h2 className={styles.profileName}>
                                {data.profile.firstName} {data.profile.lastName}
                            </h2>
                            <p className={styles.profileMeta}>
                                {data.profile.occupation} · {data.profile.status}
                            </p>
                        </div>
                    </div>

                    <dl className={styles.profileFacts}>
                        <div>
                            <dt>Annual income</dt>
                            <dd>{data.annualIncome}</dd>
                        </div>
                        <div>
                            <dt>Annual expense</dt>
                            <dd>{data.annualExpense}</dd>
                        </div>
                        <div>
                            <dt>Monthly average</dt>
                            <dd>{data.monthlyAverage}</dd>
                        </div>
                        <div>
                            <dt>Savings rate</dt>
                            <dd>{data.savingsRate}</dd>
                        </div>
                    </dl>

                    <div className={styles.highlightList}>
                        {data.highlights.map((item) => (
                            <div className={styles.highlightRow} key={item.label}>
                                <span>{item.label}</span>
                                <strong>{item.value}</strong>
                            </div>
                        ))}
                    </div>
                </article>

                <article className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <div>
                            <p className={styles.panelKicker}>Income vs expense</p>
                            <h2 className={styles.panelTitle}>Last 6 months</h2>
                        </div>
                    </div>

                    <div className={styles.chart}>
                        {data.trend.map((point) => (
                            <div className={styles.chartRow} key={point.month}>
                                <div className={styles.chartLabel}>{point.month}</div>
                                <div className={styles.chartBars}>
                                    <div
                                        className={styles.incomeBar}
                                        style={{ width: `${point.income}%` }}
                                    />
                                    <div
                                        className={styles.expenseBar}
                                        style={{ width: `${point.expense}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </article>

                <article className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <div>
                            <p className={styles.panelKicker}>Category share</p>
                            <h2 className={styles.panelTitle}>Top expense buckets</h2>
                        </div>
                    </div>

                    <div className={styles.categoryList}>
                        {data.categories.map((category) => (
                            <div className={styles.categoryRow} key={category.name}>
                                <div className={styles.categoryCopy}>
                                    <strong>{category.name}</strong>
                                    <span>{category.amount}</span>
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
                </article>
            </section>
        </section>
    );
}

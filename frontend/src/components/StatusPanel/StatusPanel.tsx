import styles from './StatusPanel.module.scss';
import type { StatusPanelProps } from './StatusPanelProps';

export function StatusPanel({ apiHealth, error }: StatusPanelProps) {
    const syncedAt = apiHealth ? new Date(apiHealth.timestamp).toLocaleString() : 'Pending';

    return (
        <aside className={styles.panel}>
            <div className={styles.header}>
                <p className={styles.eyebrow}>System pulse</p>
                <h2 className={styles.title}>Pocket ledger status</h2>
            </div>
            <div className={styles.row}>
                <span className={styles.label}>API status</span>
                <strong className={styles.value}>{apiHealth?.status ?? 'checking'}</strong>
            </div>
            <div className={styles.row}>
                <span className={styles.label}>Database</span>
                <strong className={styles.value}>{apiHealth?.database ?? 'waiting'}</strong>
            </div>
            <div className={styles.row}>
                <span className={styles.label}>Last sync</span>
                <strong className={styles.value}>{syncedAt}</strong>
            </div>
            {error ? <p className={styles.error}>{error}</p> : null}
        </aside>
    );
}

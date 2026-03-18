import type { HighlightItem } from '../../content/home.types';
import styles from './HighlightGrid.module.scss';

type HighlightGridProps = {
    id?: string;
    items: HighlightItem[];
};

export function HighlightGrid({ id, items }: HighlightGridProps) {
    return (
        <section className={styles.grid} id={id}>
            {items.map((item) => (
                <article className={styles.card} key={item.label}>
                    <p className={styles.label}>{item.label}</p>
                    <h2 className={styles.value}>{item.value}</h2>
                    <p className={styles.detail}>{item.detail}</p>
                </article>
            ))}
        </section>
    );
}

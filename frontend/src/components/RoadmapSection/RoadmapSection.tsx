import styles from './RoadmapSection.module.scss';
import type { RoadmapSectionProps } from './RoadmapSectionProps.ts';

export function RoadmapSection({ id, title, items }: RoadmapSectionProps) {
    return (
        <section className={styles.section} id={id}>
            <div>
                <p className={styles.eyebrow}>Starter scope</p>
                <h2 className={styles.title}>{title}</h2>
            </div>

            <div className={styles.list}>
                {items.map((item) => (
                    <div className={styles.item} key={item.title}>
                        <span className={styles.dot} />
                        <div>
                            <p className={styles.itemTitle}>{item.title}</p>
                            <p className={styles.itemDetail}>{item.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

import type { HeroContent } from '../../content/home.types';
import type { ApiHealth } from '../../lib/api';
import { StatusPanel } from '../StatusPanel/StatusPanel';
import styles from './HeroSection.module.scss';

type HeroSectionProps = {
    id?: string;
    hero: HeroContent;
    apiHealth: ApiHealth | null;
    error: string | null;
};

export function HeroSection({ id, hero, apiHealth, error }: HeroSectionProps) {
    return (
        <section className={styles.section} id={id}>
            <div className={styles.copy}>
                <p className={styles.eyebrow}>{hero.eyebrow}</p>
                <h1 className={styles.title}>{hero.title}</h1>
                <p className={styles.lead}>{hero.description}</p>
                <div className={styles.actions}>
                    <button className={styles.primaryAction} type="button">
                        {hero.primaryAction}
                    </button>
                    <button className={styles.secondaryAction} type="button">
                        {hero.secondaryAction}
                    </button>
                </div>
                <div className={styles.chips}>
                    {hero.chips.map((chip) => (
                        <span className={styles.chip} key={chip}>
                            {chip}
                        </span>
                    ))}
                </div>
            </div>

            <StatusPanel apiHealth={apiHealth} error={error} />
        </section>
    );
}

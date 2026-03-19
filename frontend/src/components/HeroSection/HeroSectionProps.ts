import type { HeroContent } from '../../content/HeroContent.ts';
import type { ApiHealth } from '../../lib/ApiHealth.ts';

export type HeroSectionProps = {
    id?: string;
    hero: HeroContent;
    apiHealth: ApiHealth | null;
    error: string | null;
};

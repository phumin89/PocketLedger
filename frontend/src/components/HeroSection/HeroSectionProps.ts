import type { HeroContent } from '../../content/HeroContent';
import type { ApiHealth } from '../../lib/ApiHealth';

export type HeroSectionProps = {
    id?: string;
    hero: HeroContent;
    apiHealth: ApiHealth | null;
    error: string | null;
};

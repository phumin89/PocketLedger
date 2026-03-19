import type { RoadmapItem } from '../../content/RoadmapItem.ts';

export type RoadmapSectionProps = {
    id?: string;
    title: string;
    items: RoadmapItem[];
};

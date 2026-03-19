import type { RoadmapItem } from '../../content/RoadmapItem';

export type RoadmapSectionProps = {
    id?: string;
    title: string;
    items: RoadmapItem[];
};

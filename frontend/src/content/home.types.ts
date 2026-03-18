export type HeroContent = {
    eyebrow: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
    chips: string[];
};

export type HighlightItem = {
    label: string;
    value: string;
    detail: string;
};

export type NavItem = {
    label: string;
    to: string;
    end?: boolean;
};

export type RoadmapItem = {
    title: string;
    detail: string;
};

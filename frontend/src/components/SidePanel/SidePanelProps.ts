import type { ReactNode } from 'react';

export interface SidePanelProps {
    readonly kicker?: string;
    readonly title: string;
    readonly description?: string;
    readonly children: ReactNode;
    readonly footer?: ReactNode | ((requestClose: () => void) => ReactNode);
    readonly onClose: () => void;
}

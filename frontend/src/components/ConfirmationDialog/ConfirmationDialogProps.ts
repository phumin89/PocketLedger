export interface ConfirmationDialogProps {
    readonly description?: string;
    readonly confirmLabel: string;
    readonly isBusy?: boolean;
    readonly isOpen: boolean;
    readonly title: string;
    readonly onCancel: () => void;
    readonly onConfirm: () => void;
}

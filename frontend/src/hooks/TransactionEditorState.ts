import type { TransactionFormData } from '../content/TransactionFormData';

export type TransactionEditorState = {
    draft: TransactionFormData;
    notice: string | null;
    isDirty: boolean;
    updateField: <TKey extends keyof TransactionFormData>(
        field: TKey,
        value: TransactionFormData[TKey]
    ) => void;
    reset: () => void;
    save: () => void;
    remove: () => void;
};

import { useEffect, useMemo, useState } from 'react';
import type { TransactionFormData } from '../content/transaction.types';

type TransactionEditorState = {
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

export function useTransactionEditor(
    initialTransaction: TransactionFormData
): TransactionEditorState {
    const [baseline, setBaseline] = useState(initialTransaction);
    const [draft, setDraft] = useState(initialTransaction);
    const [notice, setNotice] = useState<string | null>(null);

    useEffect(() => {
        setBaseline(initialTransaction);
        setDraft(initialTransaction);
        setNotice(null);
    }, [initialTransaction.id]);

    const isDirty = useMemo(
        () => JSON.stringify(draft) !== JSON.stringify(baseline),
        [baseline, draft]
    );

    function updateField<TKey extends keyof TransactionFormData>(
        field: TKey,
        value: TransactionFormData[TKey]
    ) {
        setDraft((current) => ({
            ...current,
            [field]: value,
        }));
        setNotice(null);
    }

    function reset() {
        setDraft(baseline);
        setNotice('Changes discarded.');
    }

    function save() {
        setBaseline(draft);
        setNotice('Mock transaction saved.');
    }

    function remove() {
        setNotice('Mock delete queued. Connect this to the delete command later.');
    }

    return {
        draft,
        notice,
        isDirty,
        updateField,
        reset,
        save,
        remove,
    };
}

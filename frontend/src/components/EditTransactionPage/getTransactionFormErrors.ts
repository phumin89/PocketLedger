import type { TransactionFormData } from '../../content/TransactionFormData';
import type { TransactionFormErrors } from './TransactionFormErrors';

export function getTransactionFormErrors(draft: TransactionFormData): TransactionFormErrors {
    const title = draft.title.trim();
    const amount = Number(draft.amount);
    const note = draft.note.trim();

    return {
        title:
            title.length === 0 ? 'Enter a title for this transaction.' : title.length > 120 ? 'Title must be 120 characters or fewer.' : null,
        amount:
            draft.amount.trim().length === 0
                ? 'Enter an amount.'
                : !Number.isFinite(amount) || amount <= 0
                  ? 'Amount must be greater than 0.'
                  : null,
        occurredAt: /^\d{4}-\d{2}-\d{2}$/.test(draft.occurredAt)
            ? null
            : 'Choose a valid transaction date.',
        note: note.length > 500 ? 'Note must be 500 characters or fewer.' : null,
    };
}

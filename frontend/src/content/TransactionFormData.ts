import type { TransactionTypeOption } from './TransactionTypeOption';

export type TransactionFormData = {
    id: string;
    title: string;
    amount: string;
    type: TransactionTypeOption;
    category: string;
    occurredAt: string;
    account: string;
    reference: string;
    note: string;
    status: string;
};

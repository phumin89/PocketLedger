export type TransactionTypeOption = 'INCOME' | 'EXPENSE';

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

export type TransactionRecord = TransactionFormData & {
    createdAt: string;
    updatedAt: string;
    source: string;
};

export type TransactionMeta = {
    createdAt: string;
    updatedAt: string;
    source: string;
};

export type TransactionEditorData = {
    pageTitle: string;
    description: string;
    transaction: TransactionFormData;
    categories: string[];
    accounts: string[];
    meta: TransactionMeta;
};

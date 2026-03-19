import type { TransactionFormData } from './TransactionFormData';
import type { TransactionMeta } from './TransactionMeta';

export type TransactionEditorData = {
    pageTitle: string;
    description: string;
    transaction: TransactionFormData;
    categories: string[];
    accounts: string[];
    meta: TransactionMeta;
};

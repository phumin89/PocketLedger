import type { TransactionFormData } from './TransactionFormData.ts';
import type { TransactionMeta } from './TransactionMeta.ts';

export type TransactionEditorData = {
    pageTitle: string;
    description: string;
    transaction: TransactionFormData;
    categories: string[];
    accounts: string[];
    meta: TransactionMeta;
};

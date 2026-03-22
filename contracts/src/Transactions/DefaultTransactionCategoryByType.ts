import { TransactionCategory } from '../enum/transaction-category.enum.ts';
import { TransactionType } from '../enum/transaction-type.enum.ts';

export const DefaultTransactionCategoryByType = {
    [TransactionType.INCOME]: TransactionCategory.OTHER,
    [TransactionType.EXPENSE]: TransactionCategory.OTHER,
} as const satisfies Record<TransactionType, TransactionCategory>;

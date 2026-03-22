import { TransactionCategory } from '../enum/transaction-category.enum.ts';
import { TransactionType } from '../enum/transaction-type.enum.ts';

export const TransactionCategoriesByType: Record<TransactionType, readonly TransactionCategory[]> =
    {
    [TransactionType.INCOME]: [
        TransactionCategory.SALARY,
        TransactionCategory.OVERTIME,
        TransactionCategory.BONUS,
        TransactionCategory.COMMISSION,
        TransactionCategory.FREELANCE,
        TransactionCategory.BUSINESS,
        TransactionCategory.INVESTMENT,
        TransactionCategory.GIFT,
        TransactionCategory.OTHER,
    ],
    [TransactionType.EXPENSE]: [
        TransactionCategory.FOOD,
        TransactionCategory.TRANSPORT,
        TransactionCategory.HOUSING,
        TransactionCategory.BILLS,
        TransactionCategory.HEALTH,
        TransactionCategory.SHOPPING,
        TransactionCategory.ENTERTAINMENT,
        TransactionCategory.SPORT,
        TransactionCategory.CREDIT_CARD,
        TransactionCategory.SAVINGS,
        TransactionCategory.OTHER,
    ],
    };

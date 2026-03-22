import {
    TransactionCategoriesByType,
    TransactionCategory,
    TransactionType,
    type ITransactionCreateRequest,
} from '@pocketledger/contracts';
import { z } from 'zod';

export const CreateTransactionRequestBodySchema: z.ZodType<
    ITransactionCreateRequest,
    z.ZodTypeDef,
    unknown
> = z
    .object({
        title: z.string().trim().min(1).max(120),
        amount: z.coerce.number().positive(),
        type: z.nativeEnum(TransactionType),
        category: z.nativeEnum(TransactionCategory),
        occurredAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        note: z.string().trim().max(500).default(''),
    })
    .strict()
    .superRefine((value, context) => {
        if (!TransactionCategoriesByType[value.type].includes(value.category)) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['category'],
                message: 'Category is not valid for the selected type.',
            });
        }
    });

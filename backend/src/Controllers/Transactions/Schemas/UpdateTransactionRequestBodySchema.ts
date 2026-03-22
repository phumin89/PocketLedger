import {
    TransactionCategoriesByType,
    TransactionCategory,
    TransactionType,
    type ITransactionUpdateRequest,
} from '@pocketledger/contracts';
import { z } from 'zod';

export const UpdateTransactionRequestBodySchema: z.ZodType<
    ITransactionUpdateRequest,
    z.ZodTypeDef,
    unknown
> = z
    .object({
        id: z.string().trim().min(1),
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

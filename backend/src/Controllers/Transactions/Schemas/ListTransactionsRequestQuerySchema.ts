import type { ITransactionsListRequest } from '@pocketledger/contracts';
import { z } from 'zod';

export const ListTransactionsRequestQuerySchema: z.ZodType<
    ITransactionsListRequest,
    z.ZodTypeDef,
    unknown
> = z
    .object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    })
    .strict();

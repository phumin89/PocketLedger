import type { ITransactionDetailRequest } from '@pocketledger/contracts';
import { z } from 'zod';

export const DetailTransactionRequestQuerySchema: z.ZodType<
    ITransactionDetailRequest,
    z.ZodTypeDef,
    unknown
> = z
    .object({
        id: z.string().trim().min(1),
    })
    .strict();

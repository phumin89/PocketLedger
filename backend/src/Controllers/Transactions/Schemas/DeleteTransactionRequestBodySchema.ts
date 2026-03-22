import type { ITransactionDeleteRequest } from '@pocketledger/contracts';
import { z } from 'zod';

export const DeleteTransactionRequestBodySchema: z.ZodType<
    ITransactionDeleteRequest,
    z.ZodTypeDef,
    unknown
> = z
    .object({
        id: z.string().trim().min(1),
    })
    .strict();

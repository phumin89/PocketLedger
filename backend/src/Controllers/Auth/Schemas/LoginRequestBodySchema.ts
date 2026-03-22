import type { ILoginRequest } from '@pocketledger/contracts';
import { z } from 'zod';

export const LoginRequestBodySchema: z.ZodType<ILoginRequest, z.ZodTypeDef, unknown> = z
    .object({
        username: z
            .string()
            .trim()
            .min(3)
            .max(64)
            .regex(/^[a-z0-9._-]+$/i),
        password: z.string().min(8).max(128),
    })
    .strict();

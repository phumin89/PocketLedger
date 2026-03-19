import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import Fastify, { type FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import type { IApplicationDependencies } from './composition/Contracts/IApplicationDependencies.ts';
import { createApplicationDependencies } from './composition/createApplicationDependencies.ts';
import { createApiRoutes } from './routes/CreateApiRoutes.ts';

function resolveAllowedOrigins(frontendOrigin: string | undefined): string[] | true {
    const allowedOrigins = frontendOrigin
        ?.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

    return allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : true;
}

function resolveStatusCode(error: unknown): number {
    if (!error || typeof error !== 'object' || !('statusCode' in error)) {
        return 500;
    }

    const { statusCode } = error as { statusCode?: unknown };

    return typeof statusCode === 'number' ? statusCode : 500;
}

function resolveErrorMessage(error: unknown, statusCode: number): string {
    if (statusCode >= 500) {
        return 'Internal server error.';
    }

    return error instanceof Error ? error.message : 'Request failed.';
}

export function buildApp(
    dependencies: IApplicationDependencies = createApplicationDependencies()
): FastifyInstance {
    const app = Fastify({
        logger: true,
    });

    void app.register(cors, {
        origin: resolveAllowedOrigins(process.env.FRONTEND_ORIGIN),
    });

    void app.register(sensible);
    void app.register(createApiRoutes(dependencies), { prefix: '/api' });

    app.setErrorHandler((error, _request, reply) => {
        if (error instanceof ZodError) {
            return reply.status(400).send({
                message: 'Validation failed.',
                issues: error.issues.map((issue) => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                })),
            });
        }

        const statusCode = resolveStatusCode(error);

        app.log.error(error);

        return reply.status(statusCode).send({
            message: resolveErrorMessage(error, statusCode),
        });
    });

    app.addHook('onClose', async () => {
        await dependencies.dbContext.$disconnect();
    });

    return app;
}

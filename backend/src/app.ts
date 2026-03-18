import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { prisma } from '@pocketledger/database';
import Fastify from 'fastify';
import { ZodError } from 'zod';
import { apiRoutes } from './routes/index.js';

export function buildApp() {
    const app = Fastify({
        logger: true,
    });

    const origins = process.env.FRONTEND_ORIGIN?.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

    void app.register(cors, {
        origin: origins && origins.length > 0 ? origins : true,
    });

    void app.register(sensible);
    void app.register(apiRoutes, { prefix: '/api' });

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

        const statusCode =
            typeof error === 'object' &&
            error !== null &&
            'statusCode' in error &&
            typeof error.statusCode === 'number'
                ? error.statusCode
                : 500;

        app.log.error(error);

        return reply.status(statusCode).send({
            message:
                statusCode >= 500
                    ? 'Internal server error.'
                    : error instanceof Error
                      ? error.message
                      : 'Request failed.',
        });
    });

    app.addHook('onClose', async () => {
        await prisma.$disconnect();
    });

    return app;
}

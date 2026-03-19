import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import Fastify, { type FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import type { IApplicationDependencies } from './composition/Contracts/IApplicationDependencies.ts';
export class ApplicationBuilder {
    private readonly dependencies: IApplicationDependencies;

    public constructor(dependencies: IApplicationDependencies) {
        this.dependencies = dependencies;
    }

    public build(): FastifyInstance {
        const app = Fastify({
            logger: true,
        });

        void app.register(cors, {
            credentials: true,
            origin: this.resolveAllowedOrigins(process.env.FRONTEND_ORIGIN),
        });

        void app.register(sensible);
        void app.decorateRequest('authenticatedUserId', null);
        void app.register(this.dependencies.apiRouteRegistrar.register, { prefix: '/api' });

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

            const statusCode = this.resolveStatusCode(error);

            app.log.error(error);

            return reply.status(statusCode).send({
                message: this.resolveErrorMessage(error, statusCode),
            });
        });

        app.addHook('onClose', async () => {
            await this.dependencies.dbContext.$disconnect();
        });

        return app;
    }

    private resolveAllowedOrigins(frontendOrigin: string | undefined): string[] | true {
        const allowedOrigins = frontendOrigin
            ?.split(',')
            .map((origin) => origin.trim())
            .filter(Boolean);

        return allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : true;
    }

    private resolveStatusCode(error: unknown): number {
        if (!error || typeof error !== 'object' || !('statusCode' in error)) {
            return 500;
        }

        const { statusCode } = error as { statusCode?: unknown };

        return typeof statusCode === 'number' ? statusCode : 500;
    }

    private resolveErrorMessage(error: unknown, statusCode: number): string {
        if (statusCode >= 500) {
            return 'Internal server error.';
        }

        return error instanceof Error ? error.message : 'Request failed.';
    }
}

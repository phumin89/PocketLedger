import type { ICurrentUserContext } from '@pocketledger/application';
import type { FastifyInstance, FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';
import { z } from 'zod';
import { ControllerBase } from '../Controllers/ControllerBase.ts';
import type { RequireAuthenticatedUserPreHandler } from '../PreHandlers/Auth/RequireAuthenticatedUserPreHandler.ts';
import { EndpointRouteRegistrarBase } from './EndpointRouteRegistrarBase.ts';

export abstract class AuthenticatedRouteRegistrarBase extends EndpointRouteRegistrarBase {
    private readonly currentUserContext: ICurrentUserContext;
    private readonly requireAuthenticatedUserPreHandler: RequireAuthenticatedUserPreHandler;

    protected constructor(
        requireAuthenticatedUserPreHandler: RequireAuthenticatedUserPreHandler,
        currentUserContext: ICurrentUserContext
    ) {
        super();
        this.currentUserContext = currentUserContext;
        this.requireAuthenticatedUserPreHandler = requireAuthenticatedUserPreHandler;
    }

    protected protect(app: FastifyInstance): void {
        app.addHook('preHandler', this.requireAuthenticatedUserPreHandler.handle);
    }

    protected registerAuthenticatedControllerGet(
        app: FastifyInstance,
        controller: ControllerBase,
        actionName: string,
        handler: (
            request: FastifyRequest & { authenticatedUserId: string },
            reply: FastifyReply
        ) => ReturnType<RouteHandlerMethod>
    ): void {
        this.registerControllerGet(
            app,
            controller,
            actionName,
            this.withCurrentUserContext(handler) as RouteHandlerMethod
        );
    }

    protected registerAuthenticatedValidatedControllerPost<TBody>(
        app: FastifyInstance,
        controller: ControllerBase,
        actionName: string,
        bodySchema: z.ZodType<TBody, z.ZodTypeDef, unknown>,
        handler: (
            request: FastifyRequest<{ Body: TBody }> & { authenticatedUserId: string },
            reply: FastifyReply
        ) => ReturnType<RouteHandlerMethod>
    ): void {
        this.registerValidatedControllerPost(
            app,
            controller,
            actionName,
            bodySchema,
            this.withCurrentUserContext(handler) as (
                request: FastifyRequest<{ Body: TBody }>,
                reply: FastifyReply
            ) => ReturnType<RouteHandlerMethod>
        );
    }

    protected registerAuthenticatedValidatedControllerGet<TQuerystring>(
        app: FastifyInstance,
        controller: ControllerBase,
        actionName: string,
        querySchema: z.ZodType<TQuerystring, z.ZodTypeDef, unknown>,
        handler: (
            request: FastifyRequest<{ Querystring: TQuerystring }> & {
                authenticatedUserId: string;
            },
            reply: FastifyReply
        ) => ReturnType<RouteHandlerMethod>
    ): void {
        this.registerValidatedControllerGet(
            app,
            controller,
            actionName,
            querySchema,
            this.withCurrentUserContext(handler) as (
                request: FastifyRequest<{ Querystring: TQuerystring }>,
                reply: FastifyReply
            ) => ReturnType<RouteHandlerMethod>
        );
    }

    protected registerAuthenticatedValidatedControllerPut<TBody>(
        app: FastifyInstance,
        controller: ControllerBase,
        actionName: string,
        bodySchema: z.ZodType<TBody, z.ZodTypeDef, unknown>,
        handler: (
            request: FastifyRequest<{ Body: TBody }> & { authenticatedUserId: string },
            reply: FastifyReply
        ) => ReturnType<RouteHandlerMethod>
    ): void {
        this.registerValidatedControllerPut(
            app,
            controller,
            actionName,
            bodySchema,
            this.withCurrentUserContext(handler) as (
                request: FastifyRequest<{ Body: TBody }>,
                reply: FastifyReply
            ) => ReturnType<RouteHandlerMethod>
        );
    }

    protected registerAuthenticatedValidatedControllerDelete<TBody>(
        app: FastifyInstance,
        controller: ControllerBase,
        actionName: string,
        bodySchema: z.ZodType<TBody, z.ZodTypeDef, unknown>,
        handler: (
            request: FastifyRequest<{ Body: TBody }> & { authenticatedUserId: string },
            reply: FastifyReply
        ) => ReturnType<RouteHandlerMethod>
    ): void {
        this.registerValidatedControllerDelete(
            app,
            controller,
            actionName,
            bodySchema,
            this.withCurrentUserContext(handler) as (
                request: FastifyRequest<{ Body: TBody }>,
                reply: FastifyReply
            ) => ReturnType<RouteHandlerMethod>
        );
    }

    private withCurrentUserContext<TRequest extends FastifyRequest>(
        handler: (
            request: TRequest & { authenticatedUserId: string },
            reply: FastifyReply
        ) => ReturnType<RouteHandlerMethod>
    ) {
        return (request: TRequest, reply: FastifyReply): ReturnType<RouteHandlerMethod> => {
            if (!request.authenticatedUserId) {
                return reply.code(500).send({
                    message: 'Authenticated user context is missing.',
                }) as ReturnType<RouteHandlerMethod>;
            }

            return this.currentUserContext.runWithCurrentUserId(request.authenticatedUserId, () =>
                handler(request as TRequest & { authenticatedUserId: string }, reply)
            );
        };
    }
}

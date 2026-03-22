import type {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    HTTPMethods,
    RouteHandlerMethod,
} from 'fastify';
import { z } from 'zod';
import { ControllerBase } from '../Controllers/ControllerBase.ts';

export abstract class EndpointRouteRegistrarBase {
    protected registerControllerGet(
        app: FastifyInstance,
        controller: ControllerBase,
        actionName: string,
        handler: RouteHandlerMethod
    ): void {
        this.registerRoute(
            app,
            'GET',
            controller.constructor.name.replace(/Controller$/, ''),
            controller.constructor.name,
            actionName,
            handler
        );
    }

    protected registerValidatedControllerGet<TQuerystring>(
        app: FastifyInstance,
        controller: ControllerBase,
        actionName: string,
        querySchema: z.ZodType<TQuerystring, z.ZodTypeDef, unknown>,
        handler: (
            request: FastifyRequest<{ Querystring: TQuerystring }>,
            reply: FastifyReply
        ) => ReturnType<RouteHandlerMethod>
    ): void {
        this.registerRoute(
            app,
            'GET',
            controller.constructor.name.replace(/Controller$/, ''),
            controller.constructor.name,
            actionName,
            handler as RouteHandlerMethod,
            undefined,
            querySchema
        );
    }

    protected registerControllerPost(
        app: FastifyInstance,
        controller: ControllerBase,
        actionName: string,
        handler: RouteHandlerMethod
    ): void {
        this.registerRoute(
            app,
            'POST',
            controller.constructor.name.replace(/Controller$/, ''),
            controller.constructor.name,
            actionName,
            handler
        );
    }

    protected registerValidatedControllerPost<TBody>(
        app: FastifyInstance,
        controller: ControllerBase,
        actionName: string,
        bodySchema: z.ZodType<TBody, z.ZodTypeDef, unknown>,
        handler: (
            request: FastifyRequest<{ Body: TBody }>,
            reply: FastifyReply
        ) => ReturnType<RouteHandlerMethod>
    ): void {
        this.registerRoute(
            app,
            'POST',
            controller.constructor.name.replace(/Controller$/, ''),
            controller.constructor.name,
            actionName,
            handler as RouteHandlerMethod,
            bodySchema
        );
    }

    protected registerValidatedControllerPut<TBody>(
        app: FastifyInstance,
        controller: ControllerBase,
        actionName: string,
        bodySchema: z.ZodType<TBody, z.ZodTypeDef, unknown>,
        handler: (
            request: FastifyRequest<{ Body: TBody }>,
            reply: FastifyReply
        ) => ReturnType<RouteHandlerMethod>
    ): void {
        this.registerRoute(
            app,
            'PUT',
            controller.constructor.name.replace(/Controller$/, ''),
            controller.constructor.name,
            actionName,
            handler as RouteHandlerMethod,
            bodySchema
        );
    }

    protected registerValidatedControllerDelete<TBody>(
        app: FastifyInstance,
        controller: ControllerBase,
        actionName: string,
        bodySchema: z.ZodType<TBody, z.ZodTypeDef, unknown>,
        handler: (
            request: FastifyRequest<{ Body: TBody }>,
            reply: FastifyReply
        ) => ReturnType<RouteHandlerMethod>
    ): void {
        this.registerRoute(
            app,
            'DELETE',
            controller.constructor.name.replace(/Controller$/, ''),
            controller.constructor.name,
            actionName,
            handler as RouteHandlerMethod,
            bodySchema
        );
    }

    protected registerNamedGet(
        app: FastifyInstance,
        endpointGroupName: string,
        actionName: string,
        handler: RouteHandlerMethod
    ): void {
        this.registerRoute(app, 'GET', endpointGroupName, endpointGroupName, actionName, handler);
    }

    private registerRoute(
        app: FastifyInstance,
        method: HTTPMethods,
        routeGroupName: string,
        endpointOwnerName: string,
        actionName: string,
        handler: RouteHandlerMethod,
        bodySchema?: z.ZodTypeAny,
        querySchema?: z.ZodTypeAny
    ): void {
        app.route({
            method,
            url: this.resolveRoutePath(routeGroupName, actionName),
            config: {
                endpointName: this.resolveEndpointName(endpointOwnerName, actionName),
            },
            preValidation:
                bodySchema || querySchema
                    ? async (request) => {
                          if (querySchema) {
                              request.query = querySchema.parse(request.query);
                          }

                          if (bodySchema) {
                              request.body = bodySchema.parse(request.body);
                          }
                      }
                    : undefined,
            handler,
        });
    }

    private resolveRoutePath(routeGroupName: string, actionName: string): string {
        const controllerSegment = this.toKebabCase(routeGroupName);
        const actionSegment = this.toKebabCase(actionName.replace(/Async$/, ''));

        return `/${controllerSegment}/${actionSegment}`;
    }

    private resolveEndpointName(endpointOwnerName: string, actionName: string): string {
        return `${endpointOwnerName}.${actionName.replace(/Async$/, '')}`;
    }

    private toKebabCase(value: string): string {
        return value
            .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
            .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
            .replace(/[_\s]+/g, '-')
            .toLowerCase();
    }
}

import type { FastifyInstance, HTTPMethods, RouteHandlerMethod } from 'fastify';
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
        handler: RouteHandlerMethod
    ): void {
        app.route({
            method,
            url: this.resolveRoutePath(routeGroupName, actionName),
            config: {
                endpointName: this.resolveEndpointName(endpointOwnerName, actionName),
            },
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

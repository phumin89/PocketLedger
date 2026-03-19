import type { FastifyReply } from 'fastify';

export abstract class ControllerBase {
    protected Ok<TResponse>(reply: FastifyReply, response: TResponse): FastifyReply {
        return reply.send(response);
    }

    protected Unauthorized(
        reply: FastifyReply,
        message: string = 'Authentication required.'
    ): FastifyReply {
        return this.Message(reply, 401, message);
    }

    protected NotFound(reply: FastifyReply, message: string = 'Resource not found.'): FastifyReply {
        return this.Message(reply, 404, message);
    }

    protected ServerError(
        reply: FastifyReply,
        message: string = 'Internal server error.'
    ): FastifyReply {
        return this.Message(reply, 500, message);
    }

    protected NotImplemented(
        reply: FastifyReply,
        message: string = 'Not implemented.'
    ): FastifyReply {
        return this.Message(reply, 501, message);
    }

    private Message(reply: FastifyReply, statusCode: number, message: string): FastifyReply {
        return reply.code(statusCode).send({
            message,
        });
    }
}

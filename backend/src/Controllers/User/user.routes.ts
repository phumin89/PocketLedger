import type { FastifyPluginAsync } from 'fastify';
import { userController } from './index.js';

export const userRoutes: FastifyPluginAsync = async (app) => {
    app.get('/queries/users/me', async (request, reply) => {
        return userController.getCurrentUser(request, reply);
    });

    app.get('/users/me', async (request, reply) => {
        return userController.getCurrentUser(request, reply);
    });
};

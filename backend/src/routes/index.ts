import type { FastifyPluginAsync } from 'fastify';
import { userRoutes } from '../Controllers/User/user.routes.js';
import { healthRoute } from './health.js';

export const apiRoutes: FastifyPluginAsync = async (app) => {
    await app.register(healthRoute);
    await app.register(userRoutes);
};

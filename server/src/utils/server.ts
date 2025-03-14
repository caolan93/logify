import fastify from 'fastify';
import { logger } from './logger';
import { applicationRoutes } from '../modules/applications/applications.routes';
import { userRoutes } from '../modules/users/users.routes';

export async function buildServer() {
	const app = fastify({
		logger,
	});

	// Register Plugins

	// Register Routes
	app.register(applicationRoutes, {
		prefix: '/api/v1/applications',
	});
	app.register(userRoutes, {
		prefix: '/api/v1/users',
	});

	return app;
}

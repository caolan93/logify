import fastify from 'fastify';
import { logger } from './logger';

export async function buildServer() {
	const app = fastify({
		logger,
	});

	// Register Plugins

	// Register Routes

	return app;
}

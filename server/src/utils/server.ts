import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { logger } from './logger';
import { applicationRoutes } from '../modules/applications/applications.routes';
import { userRoutes } from '../modules/users/users.routes';
import { roleRoutes } from '../modules/roles/roles.routes';
import guard from 'fastify-guard';
import jwt from 'jsonwebtoken';

export async function buildServer() {
	const app = fastify({
		logger,
	});

	// app.addHook(
	// 	'onRequest',
	// 	async function (request: FastifyRequest, reply: FastifyReply) {
	// 		const authHeader = request.headers.authorization;
	// 		if (!authHeader) {
	// 			return;
	// 		}

	// 		try {
	// 			const token = authHeader.replace('Bearer', '');

	// 			const decoded = jwt.verify(token, 'secret');

	// 			const user = decoded;
	// 		} catch (error) {}
	// 	},
	// );

	// // Register Plugins
	// app.register(guard, {
	// 	requestProperty: 'user',
	// 	scopeProperty: 'scopes',
	// 	errorHandler: (request: FastifyRequest, reply: FastifyReply) => {
	// 		return reply.send("You can't do that");
	// 	},
	// });

	// Register Routes
	app.register(applicationRoutes, {
		prefix: '/api/v1/applications',
	});
	app.register(userRoutes, {
		prefix: '/api/v1/users',
	});
	app.register(roleRoutes, {
		prefix: '/api/v1/roles',
	});

	return app;
}

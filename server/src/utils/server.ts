import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import guard from 'fastify-guard';
import jwt from 'jsonwebtoken';
import { applicationRoutes } from '../modules/applications/applications.routes';
import { roleRoutes } from '../modules/roles/roles.routes';
import { userRoutes } from '../modules/users/users.routes';
import { User } from './types';

export async function buildServer() {
	const app = fastify({
		logger: {
			level: 'info',
			transport: {
				target: 'pino-pretty',
				options: {
					colorize: true,
				},
			},
		},
	});

	app.decorate('user', null);
	app.addHook(
		'onRequest',
		async function (request: FastifyRequest, reply: FastifyReply) {
			const authHeader = request.headers.authorization;
			if (!authHeader) {
				return;
			}

			try {
				const token = authHeader.replace('Bearer', '');
				const decoded = jwt.verify(token, 'secret');
				request.user = decoded as User;
			} catch (error) {
				console.log(error);
				reply.code(401).send({
					message: 'Invalid token',
				});
			}
		},
	);

	// Register Plugins
	app.register(guard, {
		requestProperty: 'user',
		scopeProperty: 'scopes',
		errorHandler: (result, request: FastifyRequest, reply: FastifyReply) => {
			return reply.send("You can't do that");
		},
	});

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

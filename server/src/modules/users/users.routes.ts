import { FastifyInstance } from 'fastify';
import { createUserHandler, getUserHandler } from './users.controllers';
import { createUserJsonSchema } from './users.schema';

export async function userRoutes(app: FastifyInstance) {
	app.post(
		'/',
		{
			schema: createUserJsonSchema,
		},
		createUserHandler,
	);
	app.get('/', getUserHandler);
}

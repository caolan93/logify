import { FastifyInstance } from 'fastify';
import {
	createUserHandler,
	getUserHandler,
	loginUser,
} from './users.controllers';
import { createUserJsonSchema, loginJsonSchema } from './users.schema';

export async function userRoutes(app: FastifyInstance) {
	app.post(
		'/',
		{
			schema: createUserJsonSchema,
		},
		createUserHandler,
	);
	app.get('/', getUserHandler);
	app.post(
		'/login',
		{
			schema: loginJsonSchema,
		},
		loginUser,
	);
}

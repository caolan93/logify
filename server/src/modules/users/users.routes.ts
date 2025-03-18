import { FastifyInstance } from 'fastify';
import {
	assignRoleToUserHandler,
	createUserHandler,
	getUserHandler,
	loginUser,
} from './users.controllers';
import {
	assignRoleToUserJsonSchema,
	createUserJsonSchema,
	loginJsonSchema,
} from './users.schema';

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
	app.post(
		'/roles',
		{ schema: assignRoleToUserJsonSchema },
		assignRoleToUserHandler,
	);
}

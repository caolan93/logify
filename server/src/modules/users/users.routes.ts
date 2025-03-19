import { FastifyInstance } from 'fastify';
import {
	assignRoleToUserHandler,
	createUserHandler,
	getUserHandler,
	loginUser,
} from './users.controllers';
import {
	AssignRoleToUserBody,
	assignRoleToUserJsonSchema,
	createUserJsonSchema,
	loginJsonSchema,
} from './users.schema';
import { PERMISSIONS } from '../../config/permissions';

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
	app.post<{ Body: AssignRoleToUserBody }>(
		'/roles',
		{
			schema: assignRoleToUserJsonSchema,
			onRequest: [app.guard.scope([PERMISSIONS['users:roles:write']])],
		},
		assignRoleToUserHandler,
	);
}

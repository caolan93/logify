import { FastifyInstance } from 'fastify';
import { CreateRoleBody, createRoleJSONSchema } from './roles.schemas';
import { createRoleHandler } from './roles.controllers';
import { PERMISSIONS } from '../../config/permissions';

export async function roleRoutes(app: FastifyInstance) {
	app.post<{ Body: CreateRoleBody }>(
		'/',
		{
			schema: createRoleJSONSchema,
			onRequest: [app.guard.scope([PERMISSIONS['roles:write']])],
		},
		createRoleHandler,
	);
}

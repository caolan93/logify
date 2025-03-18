import { FastifyInstance } from 'fastify';
import { createRoleJSONSchema } from './roles.schemas';
import { createRoleHandler } from './roles.controllers';

export async function roleRoutes(app: FastifyInstance) {
	app.post(
		'/',
		{
			schema: createRoleJSONSchema,
		},
		createRoleHandler,
	);
}

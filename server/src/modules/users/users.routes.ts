import { FastifyInstance } from 'fastify';
import { createUserHandler, getUserHandler } from './users.controllers';

export async function userRoutes(app: FastifyInstance) {
	app.post('/', createUserHandler);
	app.get('/', getUserHandler);
}

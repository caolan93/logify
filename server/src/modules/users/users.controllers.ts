import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserBody } from './users.schema';
import { SYSTEM_ROLES } from '../../config/permissions';

export async function createUserHandler(
	request: FastifyRequest<{
		Body: CreateUserBody;
	}>,
	reply: FastifyReply,
) {
	const { initialUser, ...data } = request.body;

	const roleName = initialUser
		? SYSTEM_ROLES.SUPER_ADMIN
		: SYSTEM_ROLES.APPLICATION_USER;
}

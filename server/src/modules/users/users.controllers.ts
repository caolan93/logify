import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserBody } from './users.schema';
import { SYSTEM_ROLES } from '../../config/permissions';
import { getUsers } from './users.services';

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

export async function getUserHandler(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	return await getUsers();
}

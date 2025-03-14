import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserBody } from './users.schema';
import { SYSTEM_ROLES } from '../../config/permissions';
import {
	assignRoleToUser,
	createUser,
	getUsers,
	getUsersByApplication,
} from './users.services';
import { createRole, getRoleByName } from '../roles/roles.services';
import { users } from '../../db/schema';

export async function createUserHandler(
	request: FastifyRequest<{
		Body: CreateUserBody;
	}>,
	reply: FastifyReply,
) {
	try {
		const { initialUser, ...data } = request.body;

		const roleName = initialUser
			? SYSTEM_ROLES.SUPER_ADMIN
			: SYSTEM_ROLES.APPLICATION_USER;

		if (roleName === SYSTEM_ROLES.SUPER_ADMIN) {
			const appUsers = await getUsersByApplication(data.applicationId);

			if (appUsers.length > 0) {
				return reply.code(400).send({
					message: 'Application already has super admin user.',
					extensions: {
						code: 'APPLICATION_ALREADY_SUPER_USER',
						applicationId: data.applicationId,
					},
				});
			}
		}

		const role = await getRoleByName(roleName, data.applicationId);

		if (!role) {
			return reply.code(404).send({
				message: 'Role not found.',
			});
		}

		const user = await createUser(data);

		await assignRoleToUser({
			userId: user.id,
			roleId: role.id,
			applicationId: user.applicationId,
		});
	} catch (error) {}
}

export async function getUserHandler(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	return await getUsers();
}

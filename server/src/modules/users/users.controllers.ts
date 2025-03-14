import { FastifyReply, FastifyRequest } from 'fastify';
import { SYSTEM_ROLES } from '../../config/permissions';
import { getRoleByName } from '../roles/roles.services';
import { CreateUserBody, LoginBody } from './users.schema';
import {
	assignRoleToUser,
	createUser,
	getUserByEmail,
	getUsers,
	getUsersByApplication,
} from './users.services';
import jwt from 'jsonwebtoken';

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
	try {
		const user = await createUser(data);

		await assignRoleToUser({
			userId: user.id,
			roleId: role.id,
			applicationId: user.applicationId ?? '',
		});

		reply.code(200).send(user);
	} catch (error) {
		console.error(error);
		reply.code(500).send({
			message: 'There was an error when creating user.',
		});
	}
}

export async function getUserHandler(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	return await getUsers();
}

export async function loginUser(
	request: FastifyRequest<{ Body: LoginBody }>,
	reply: FastifyReply,
) {
	const { email, applicationId, password } = request.body;

	const user = getUserByEmail(email, applicationId);

	if (!user) {
		return reply.code(400).send({
			message: 'There was an error logging in.',
		});
	}

	return user;

	const token = jwt.sign(
		{
			applicationId,
			email,
		},
		'secret',
	); // Chnage this secret or signing method or get fired

	return { token };
}

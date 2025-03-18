import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { SYSTEM_ROLES } from '../../config/permissions';
import { getRoleByName } from '../roles/roles.services';
import {
	AssignRoleToUserBody,
	CreateUserBody,
	LoginBody,
} from './users.schema';
import {
	assignRoleToUser,
	createUser,
	getUserByEmail,
	getUsers,
	getUsersByApplication,
} from './users.services';

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

	const user = await getUserByEmail(email, applicationId);

	if (!user) {
		return reply.code(400).send({
			message: 'There was an error logging in.',
		});
	}

	const token = jwt.sign(
		{
			id: user.id,
			applicationId,
			email,
			scopes: user.permissions,
		},
		'secret',
	);

	return { token };
}

export async function assignRoleToUserHandler(
	request: FastifyRequest<{
		Body: AssignRoleToUserBody;
	}>,
	reply: FastifyReply,
) {
	const { userId, roleId, applicationId } = request.body;

	try {
		const result = await assignRoleToUser({
			userId,
			roleId,
			applicationId,
		});

		reply.code(200).send(result);
	} catch (error) {
		console.error(error);
		reply.code(500).send({
			message: 'There was an error when assigning role to user.',
		});
	}
}

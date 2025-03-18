import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateRoleBody } from './roles.schemas';
import { createRole } from './roles.services';
import { getRoleByName } from './roles.services';

export async function createRoleHandler(
	request: FastifyRequest<{
		Body: CreateRoleBody;
	}>,
	reply: FastifyReply,
) {
	const { name, permissions, applicationId } = request.body;

	const role = await getRoleByName(name, applicationId);

	if (role) {
		return reply.code(400).send({
			message: 'Role already exists.',
		});
	}

	try {
		const result = await createRole({
			name,
			permissions,
			applicationId,
		});

		reply.code(200).send(result);
	} catch (error) {
		console.error(error);
		reply.code(500).send({
			message: 'There was an error when creating role.',
		});
	}
}

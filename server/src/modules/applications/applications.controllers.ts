import { FastifyReply, FastifyRequest } from 'fastify';
import {
	ALL_PERMISSIONS,
	SYSTEM_ROLES,
	USER_ROLE_PERMISSIONS,
} from '../../config/permissions';
import { createRole } from '../roles/roles.services';
import { CreateApplicationBodySchema } from './applications.schemas';
import { createApplication, getApplications } from './applications.services';

export async function createApplicationHandler(
	request: FastifyRequest<{
		Body: CreateApplicationBodySchema;
	}>,
	reply: FastifyReply,
) {
	const { name } = request.body;

	const application = await createApplication({
		name,
	});

	const [superAdminRole, applicationUserRole] = await Promise.allSettled([
		createRole({
			applicationId: application.id,
			name: SYSTEM_ROLES.SUPER_ADMIN,
			permissions: ALL_PERMISSIONS as unknown as Array<string>,
		}),
		await createRole({
			applicationId: application.id,
			name: SYSTEM_ROLES.APPLICATION_USER,
			permissions: USER_ROLE_PERMISSIONS,
		}),
	]);

	if (superAdminRole.status === 'rejected') {
		throw new Error('Error when creating a super admin role');
	}
	if (applicationUserRole.status === 'rejected') {
		throw new Error('Error when creating an application user role');
	}

	return {
		application,
		superAdminRole: superAdminRole.value,
		applicationUserRole: applicationUserRole.value,
	};
}

export async function getApplicationsHandler() {
	return getApplications();
}

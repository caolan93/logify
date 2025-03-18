import { z } from 'zod';
import { ALL_PERMISSIONS } from '../../config/permissions';
import zodToJsonSchema from 'zod-to-json-schema';

export const createRoleSchema = z.object({
	name: z.string(),
	permissions: z.array(z.enum(ALL_PERMISSIONS)),
	applicationId: z.string().uuid(),
});

export type CreateRoleBody = z.infer<typeof createRoleSchema>;

export const createRoleJSONSchema = {
	body: zodToJsonSchema(createRoleSchema, 'createRoleSchema'),
};

import { InferInsertModel, InferModel } from 'drizzle-orm';
import { db } from '../../db';
import { applications } from '../../db/schema';

export async function createApplication(
	data: InferInsertModel<typeof applications>,
) {
	const result = await db.insert(applications).values(data).returning();

	return result[0];
}

export async function getApplications() {
	const result = await db.select().from(applications);

	return result;
}

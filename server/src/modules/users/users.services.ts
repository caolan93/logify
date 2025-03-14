import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { applications, users } from '../../db/schema';
import { db } from '../../db';
import argon2 from 'argon2';

export async function createUser(data: InferInsertModel<typeof users>) {
	const hashedPassword = await argon2.hash(data.password);

	const result = await db
		.insert(users)
		.values({
			...data,
			password: hashedPassword,
		})
		.returning({
			id: users.id,
			email: users.email,
			name: users.name,
			applicationId: applications.id,
		});

	return result[0];
}

export async function getUsers() {
	const result = await db.select().from(users);

	return result;
}

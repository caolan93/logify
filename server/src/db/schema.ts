import {
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';

export const applications = pgTable('applications', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 256 }).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const users = pgTable(
	'users',
	{
		id: uuid('id').defaultRandom().notNull(),
		email: varchar('email', { length: 256 }).notNull(),
		name: varchar('name', { length: 256 }).notNull(),
		applicationId: uuid('applicationId').references(() => applications.id),
		password: varchar('password', { length: 256 }).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(users) => [
		primaryKey({ columns: [users.email, users.applicationId] }),
		uniqueIndex('users_id_index').on(users.id),
	],
);

export const roles = pgTable(
	'roles',
	{
		id: uuid('id').defaultRandom().notNull(),
		name: varchar('name', { length: 256 }).notNull(),
		applicationId: uuid('applicationId').references(() => applications.id),
		permissions: text('permissions').array().$type<Array<string>>(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(roles) => [
		primaryKey({ columns: [roles.name, users.applicationId] }),
		uniqueIndex('roles_id_index').on(roles.id),
	],
);

export const usersToRoles = pgTable(
	'usersToRoles',
	{
		applicationId: uuid('applicationId')
			.references(() => applications.id)
			.notNull(),
		roleId: uuid('rolesId')
			.references(() => roles.id)
			.notNull(),
		userId: uuid('userId')
			.references(() => users.id)
			.notNull(),
	},
	(usersToRoles) => [
		primaryKey({
			columns: [
				usersToRoles.applicationId,
				usersToRoles.roleId,
				usersToRoles.userId,
			],
		}),
	],
);

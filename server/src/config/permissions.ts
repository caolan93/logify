export const ALL_PERMISSIONS = [
	// users
	'users:roles:write',
	'users:roles:read',
	'users:roles:delete',

	// roles
	'roles:write',

	// posts
	'posts:write',
	'posts:read',
] as const;

export const PERMISSIONS = ALL_PERMISSIONS.reduce((acc, permission) => {
	acc[permission] = permission;

	return acc;
}, {} as Record<(typeof ALL_PERMISSIONS)[number], (typeof ALL_PERMISSIONS)[number]>);

export const USER_ROLE_PERMISSIONS = [
	PERMISSIONS['posts:read'],
	PERMISSIONS['posts:write'],
];

export const SYSTEM_ROLES = {
	SUPER_ADMIN: 'SUPER_ADMIN',
	APPLICATION_USER: 'APPLICATION_USER',
};

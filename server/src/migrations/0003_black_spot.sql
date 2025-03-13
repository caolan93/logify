CREATE TABLE "usersToRoles" (
	"applicationId" uuid NOT NULL,
	"rolesId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT "usersToRoles_applicationId_rolesId_userId_pk" PRIMARY KEY("applicationId","rolesId","userId")
);

ALTER TABLE "usersToRoles" ADD CONSTRAINT "usersToRoles_applicationId_applications_id_fk" FOREIGN KEY ("applicationId") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "usersToRoles" ADD CONSTRAINT "usersToRoles_rolesId_roles_id_fk" FOREIGN KEY ("rolesId") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "usersToRoles" ADD CONSTRAINT "usersToRoles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	out: './src/migrations',
	schema: './src/db/schema.ts',
	breakpoints: false,
});

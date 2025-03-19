import { env } from './config/env';
import { db } from './db';
import { buildServer } from './utils/server';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

async function gracefulShutdown(app: Awaited<ReturnType<typeof buildServer>>) {
	await app.close(() => {
		console.log('Server shutting down...');
		process.exit(0);
	});
}

async function main() {
	console.log('Starting server...');
	const app = await buildServer();

	await app.listen({
		port: env.PORT,
		host: env.HOST,
	});

	await migrate(db, {
		migrationsFolder: './src/migrations',
	});
	const signals = ['SIGINT', 'SIGTERM'];

	for (const signal of signals) {
		process.on(signal, () => {
			console.log('Signal', signal);
			gracefulShutdown(app);
		});
	}
}

main();

import { logger } from './utils/logger';
import { buildServer } from './utils/server';

async function main() {
	const app = await buildServer();

	app.listen({
		port: 3000,
	});

	logger.info(`Server is running at HTTP PORT 3000`);
}

main();

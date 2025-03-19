import { FastifyInstance } from 'fastify';
import { JwtPayload } from 'jsonwebtoken';

declare module 'fastify' {
	interface FastifyRequest {
		user: {
			id: string;
			email: string;
			name: string;
			scopes: string[];
		};
	}
}

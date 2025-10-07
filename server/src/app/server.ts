import express, { type Application } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { logger } from "../config/logger";
import { registerRoutes } from "../modules/routes";
import { env } from "../config/env";
import { API_PREFIX, ERRORS, SERVICE_NAME } from "../config/constants";

export function createApp(): Application {
	const app = express();

	app.set("trust proxy", true);

	app.use(express.json());
	app.use(cors({
		origin: "*",
	}));
	app.use(
		pinoHttp({
			logger,
			customProps: () => ({ service: SERVICE_NAME }),
		}),
	);

	registerRoutes(app, API_PREFIX);

	app.get("/health", (_req, res) => res.status(200).send("OK"));

	app.use((_req, res) => {
		res.status(404).json({ error: ERRORS.notFoundRoute });
	});

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	app.use(
		(
			err: unknown,
			_req: express.Request,
			res: express.Response,
			_next: express.NextFunction,
		) => {
			logger.error({ err }, "Unhandled error");
			res.status(500).json({ error: ERRORS.internal });
		},
	);

	return app;
}

export async function startServer(): Promise<void> {
	try {
		const app = createApp();
		app.listen(env.port, () => {
			logger.info({ port: env.port }, "Server started");
		});
	} catch (err) {
		logger.fatal({ err }, "Failed to start server");
		process.exit(1);
	}
}

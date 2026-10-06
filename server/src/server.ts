import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./shared/logger.js";
import { prisma } from "./lib/prisma.js";
import { logMailStatus } from "./shared/mailer.js";

async function bootstrap() {
  const app = createApp();

  try {
    await prisma.$connect();
    logger.info("Database connection established.");
  } catch (error) {
    logger.error({ err: error }, "Failed to connect to the database.");
    process.exit(1);
  }

  const server = app.listen(env.PORT, () => {
    logger.info(
        `API server listening on http://localhost:${env.PORT}${env.API_PREFIX} (${env.NODE_ENV})`
    );
    logMailStatus();
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received - shutting down gracefully.`);

    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });

    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
}

bootstrap().catch((err) => {
  logger.error({ err }, "Bootstrap failed.");
  process.exit(1);
});
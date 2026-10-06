import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";

import { env } from "./config/env.js";
import { logger } from "./shared/logger.js";
import { generalLimiter } from "./middleware/rate-limiter.js";
import {
  errorHandler,
  notFoundHandler,
  requestId,
} from "./middleware/error-handler.js";
import {mountApiRoutes} from "./routes/index.js";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(requestId);
  app.use((pinoHttp as any)({ logger }));
  app.use(helmet());

  app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin) return callback(null, true);

          const allowedOrigins = env.CLIENT_URL.split(",").map((o: string) =>
              o.trim()
          );

          if (allowedOrigins.includes(origin)) {
            return callback(null, true);
          }

          try {
            const { hostname } = new URL(origin);
            const isLocal =
              hostname === "localhost" || hostname === "127.0.0.1";
            const isPreview = hostname.endsWith(".monkeycode-ai.live");
            if (isLocal || isPreview) {
              return callback(null, true);
            }
          } catch {
            return callback(new Error("Not allowed by CORS"));
          }

          return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
        maxAge: 86400,
      })
  );

  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  app.use(generalLimiter);

  app.get("/", (_req, res) => {
    res.json({
      success: true,
      message: "Dev Monir API is running.",
      docs: `${env.API_PREFIX}/health`,
    });
  });

  mountApiRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

const app = createApp();

export default app

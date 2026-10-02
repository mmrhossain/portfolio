import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";
import { TooManyRequestsError } from "../shared/errors.js";

export const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests, please try again later.",
    },
  },
  handler: (_req, _res, next, options) => {
    next(new TooManyRequestsError(options.message as string));
  },
});

export const authLimiter = rateLimit({
  windowMs: env.AUTH_RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many attempts. Please try again later.",
    },
  },
  handler: (_req, _res, next, options) => {
    next(new TooManyRequestsError(options.message as string));
  },
});

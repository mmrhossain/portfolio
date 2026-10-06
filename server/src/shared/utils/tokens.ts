import jwt from "jsonwebtoken";
import { randomBytes, createHash } from "crypto";
import { env, isProduction } from "../../config/env.js";
import { UnauthorizedError } from "../errors.js";
import type { Request, Response } from "express";

const JWT_ACCESS_EXPIRES_IN = 15 * 60 * 1000; // 15 minutes in milliseconds
const JWT_REFRESH_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export interface AccessTokenPayload {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
  type: "access";
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  id: string;
  type: "refresh";
  jti: string;
  iat: number;
  exp: number;
}

export function signAccessToken(payload: {
  userId: string;
  email: string;
  role: "ADMIN" | "USER";
}): string {
  return jwt.sign(
    {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      type: "access",
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    },
  );
}

export function signRefreshToken(payload: {
  userId: string;
  jti: string;
}): string {
  return jwt.sign(
    {
      id: payload.userId,
      type: "refresh",
      jti: payload.jti,
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    },
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  let payload: AccessTokenPayload;

  try {
    payload = jwt.verify(token, env.JWT_ACCESS_SECRET, {
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    }) as AccessTokenPayload;
  } catch {
    // Invalid signature, malformed, or expired token -> not a server error.
    throw new UnauthorizedError("Invalid or expired access token.");
  }

  // A refresh token must never be accepted as an access token.
  if (payload.type !== "access") {
    throw new UnauthorizedError("Invalid access token.");
  }

  return payload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  let payload: RefreshTokenPayload;

  try {
    payload = jwt.verify(token, env.JWT_REFRESH_SECRET, {
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    }) as RefreshTokenPayload;
  } catch {
    // Invalid signature, malformed, or expired token -> not a server error.
    throw new UnauthorizedError("Invalid or expired refresh token.");
  }

  // An access token must never be accepted as a refresh token.
  if (payload.type !== "refresh") {
    throw new UnauthorizedError("Invalid refresh token.");
  }

  return payload;
}

export function createTokenId(): string {
  return randomBytes(24).toString("hex");
}

/**
 * We only store a SHA-256 hash of the refresh token in the database,
 * so a database leak does not expose usable tokens.
 */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generatePasswordResetToken(): { raw: string; hash: string } {
  const raw = randomBytes(32).toString("hex");
  return { raw, hash: hashToken(raw) };
}

export function generateOtp(): string {
  return randomBytes(4).toString("hex");
}

type AuthCookieOptions = {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax" | "none";
  path: string;
  domain?: string;
  partitioned?: boolean;
};

function headerValue(
  value: string | string[] | undefined,
): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.split(",")[0]?.trim();
}

function isHttpsRequest(req: Request | undefined): boolean {
  if (!req) return false;
  if (req.secure) return true;
  if (headerValue(req.headers["x-forwarded-proto"])?.toLowerCase() === "https") {
    return true;
  }
  const origin = headerValue(req.headers.origin) ?? headerValue(req.headers.referer);
  return Boolean(origin?.toLowerCase().startsWith("https://"));
}

/**
 * Shared attributes for both auth cookies. The SAME attributes (minus maxAge)
 * must be used when clearing, otherwise the browser will not remove the cookie
 * on logout.
 *
 * - secure: true on HTTPS (including preview behind a TLS proxy) and in
 *   production. Left off for http://localhost so development login works.
 * - sameSite: "none" when Secure so preview iframes can store the cookie;
 *   "lax" on localhost HTTP (browsers reject SameSite=None without Secure).
 * - domain: omitted by default (host-only). Set COOKIE_DOMAIN in production
 *   if the API and frontend are on sibling hosts.
 */
function authCookieOptions(res: Response): AuthCookieOptions {
  const secure =
    env.COOKIE_SECURE === true || isHttpsRequest(res.req) || isProduction;

  return {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
    ...(secure ? { partitioned: true } : {}),
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
  };
}

export function setAccessCookie(res: Response, accessToken: string) {
  res.cookie("accessToken", accessToken, {
    ...authCookieOptions(res),
    maxAge: JWT_ACCESS_EXPIRES_IN,
  });
}

export function setRefreshCookie(res: Response, refreshToken: string) {
  res.cookie("refreshToken", refreshToken, {
    ...authCookieOptions(res),
    maxAge: JWT_REFRESH_EXPIRES_IN,
  });
}

export function clearAuthCookies(res: Response) {
  const options = authCookieOptions(res);
  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);
}

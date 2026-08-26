import jwt from "jsonwebtoken";
import { randomBytes, createHash } from "crypto";
import { env } from "../../config/env.js";
import type { Response } from "express";

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
  return jwt.verify(token, env.JWT_ACCESS_SECRET, {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  }) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET, {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  }) as RefreshTokenPayload;
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

export function setAccessCookie(res: Response, accessToken: string) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: JWT_ACCESS_EXPIRES_IN,
    path: "/",
    // domain: ".mmrhossain.com"
  });
}

export function setRefreshCookie(res: Response, refreshToken: string) {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: JWT_REFRESH_EXPIRES_IN,
    path: "/",
    // domain: ".mmrhossain.com"
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie("accessToken", {
    path: "/",
  });

  res.clearCookie("refreshToken", {
    path: "/",
  });
}

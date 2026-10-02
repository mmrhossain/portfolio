import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import {Prisma, User} from "../../generated/prisma/client.js"
import {
  ForbiddenError,
  UnauthorizedError,
} from "../../shared/errors.js";
import { logger } from "../../shared/logger.js";
import { env } from "../../config/env.js";
import {
  createTokenId,
  generatePasswordResetToken,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../shared/utils/tokens.js";
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
} from "./auth.schemas.js";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export type UserWithCounts = User & {
  _count?: { blogs: number };
};

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: User["role"];
  avatarUrl: string | null;
  bio: string | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  bio: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export const authService = {

  async login(input: LoginInput) {
    const user = await this.findByEmail(input.email.toLowerCase().trim());

    if (!user) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    const passwordMatch = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );
    if (!passwordMatch) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    if (!user.isActive) {
      throw new ForbiddenError(
        "This account has been deactivated. Contact an administrator.",
      );
    }

    await this.updateLastLogin(user.id);
    const tokens = await this.issueTokenPair(user.id);

    return { user: this.toSafeUser(user), ...tokens };
  },

  async issueTokenPair(userId: string) {
    const user = await this.findById(userId);
    if (!user) throw new UnauthorizedError("User not found.");

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    const jti = createTokenId();
    const refreshToken = signRefreshToken({ userId: user.id, jti });
    await this.saveRefreshToken({
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    });

    return { accessToken, refreshToken };
  },

  async refresh(refreshToken: string) {
    verifyRefreshToken(refreshToken);
    const tokenHash = hashToken(refreshToken);
    const stored = await this.findActiveRefreshToken(tokenHash);
    if (!stored) {
      throw new UnauthorizedError("Invalid or expired refresh token.");
    }

    const user = await this.findById(stored.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError("Account is unavailable.");
    }

    await this.revokeRefreshToken(tokenHash);
    const tokens = await this.issueTokenPair(user.id);
    return { user: this.toSafeUser(user), ...tokens };
  },

  async logout(refreshToken: string | undefined) {
    if (!refreshToken) return;
    await this.revokeRefreshToken(hashToken(refreshToken));
  },

  async logoutAll(userId: string) {
    await this.deleteRefreshTokens(userId);
  },

  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await this.findById(userId);
    if (!user) throw new UnauthorizedError("User not found.");

    const match = await bcrypt.compare(
      input.currentPassword,
      user.passwordHash,
    );
    if (!match) {
      throw new UnauthorizedError("Current password is incorrect.");
    }

    const passwordHash = await bcrypt.hash(input.newPassword, 12);
    await this.update(user.id, { passwordHash });
    await this.deleteRefreshTokens(user.id);
  },

  async forgotPassword(input: ForgotPasswordInput) {
    const user = await this.findByEmail(input.email.toLowerCase().trim());
    if (!user) {
      logger.info(
        { email: input.email },
        "Password reset requested for unknown email",
      );
      return { resetToken: undefined };
    }

    await this.invalidateResetTokens(user.id);
    const { raw, hash } = generatePasswordResetToken();
    await this.savePasswordResetToken({
      tokenHash: hash,
      userId: user.id,
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    });
    return { resetToken: raw, user };
  },

  async resetPassword(input: ResetPasswordInput) {
    const tokenHash = hashToken(input.token);
    const record = await this.findValidResetToken(tokenHash);
    if (!record) {
      throw new UnauthorizedError("Reset token is invalid or has expired.");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    await this.update(record.userId, { passwordHash });
    await this.markResetTokenUsed(record.id);
    await this.deleteRefreshTokens(record.userId);
  },

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: User["role"];
  }) {
    return prisma.user.create({ data });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async findSafeById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: safeUserSelect });
  },

  async update(id: string, data: Partial<Prisma.UserUpdateInput>) {
    return prisma.user.update({ where: { id }, data });
  },

  async updateLastLogin(id: string) {
    return prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
      select: { id: true, lastLoginAt: true },
    });
  },

  async deleteRefreshTokens(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId },
      data: { revokedAt: new Date() },
    });
  },

  async saveRefreshToken(input: {
    tokenHash: string;
    userId: string;
    expiresAt: Date;
  }) {
    return prisma.refreshToken.create({ data: input });
  },

  async findActiveRefreshToken(tokenHash: string) {
    return prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
    });
  },

  async revokeRefreshToken(tokenHash: string) {
    return prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  },

  async savePasswordResetToken(input: {
    tokenHash: string;
    userId: string;
    expiresAt: Date;
  }) {
    return prisma.passwordResetToken.create({ data: input });
  },

  async findValidResetToken(tokenHash: string) {
    return prisma.passwordResetToken.findFirst({
      where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
    });
  },

  async markResetTokenUsed(id: string) {
    return prisma.passwordResetToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  },

  async invalidateResetTokens(userId: string) {
    return prisma.passwordResetToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    });
  },

  toSafeUser(user: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
    avatarUrl: string | null;
    bio: string | null;
    isActive: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): SafeUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },

  buildResetLink(token: string): string {
    return `${env.APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
  },
};

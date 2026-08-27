import type { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service.js";
import { sendPasswordResetEmail } from "../../shared/mailer.js";
import { UnauthorizedError } from "../../shared/errors.js";
import {sendSuccess} from "../../shared/response.js";
import {clearAuthCookies, setAccessCookie, setRefreshCookie} from "../../shared/utils/tokens.js";


export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      setAccessCookie(res, result.accessToken);
      setRefreshCookie(res, result.refreshToken);
      return sendSuccess(res, { user: result.user }, { message: "Logged in successfully." });
    } catch (error) {
      return next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        throw new UnauthorizedError("Missing refresh token.");
      }
      const result = await authService.refresh(refreshToken);
      setAccessCookie(res, result.accessToken);
      setRefreshCookie(res, result.refreshToken);
      return sendSuccess(res, { user: result.user }, {
        message: "Token refreshed successfully.",
      });
    } catch (error) {
      return next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      await authService.logout(refreshToken);
      clearAuthCookies(res);
      return sendSuccess(res, null, { message: "Logged out successfully." });
    } catch (error) {
      return next(error);
    }
  },

  async logoutAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError("Authentication required.");
      await authService.logoutAll(req.user.userId);
      clearAuthCookies(res);
      return sendSuccess(res, null, {
        message: "Logged out from all devices.",
      });
    } catch (error) {
      return next(error);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError("Authentication required.");
      const user = await authService.findSafeById(req.user.userId);
      return sendSuccess(res, user);
    } catch (error) {
      return next(error);
    }
  },

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError("Authentication required.");
      await authService.changePassword(req.user.userId, req.body);
      clearAuthCookies(res);
      return sendSuccess(res, null, {
        message: "Password changed successfully.",
      });
    } catch (error) {
      return next(error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { resetToken } = await authService.forgotPassword(req.body);
      if (resetToken) {
        const resetLink = authService.buildResetLink(resetToken);
        await sendPasswordResetEmail(req.body.email, resetLink);
      }
      return sendSuccess(res, null, {
        message:
          "If an account exists for this email, a reset link has been sent.",
      });
    } catch (error) {
      return next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.resetPassword(req.body);
      return sendSuccess(res, null, {
        message: "Password reset successfully. You can now log in.",
      });
    } catch (error) {
      return next(error);
    }
  },
};

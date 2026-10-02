import type { Request, Response, NextFunction } from "express";
import { experienceService } from "./experience.service.js";
import { sendSuccess } from "../../shared/response.js";

export const experienceController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await experienceService.list({
        ...(req.query as Record<string, string | number | undefined>),
      });
      return sendSuccess(res, result.items, { meta: result.meta });
    } catch (error) {
      return next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const experience = await experienceService.getById(
        req.params.id as string,
      );
      return sendSuccess(res, experience);
    } catch (error) {
      return next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const experience = await experienceService.create(req.body);
      return sendSuccess(res, experience, {
        statusCode: 201,
        message: "Experience created.",
      });
    } catch (error) {
      return next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const experience = await experienceService.update(
        req.params.id as string,
        req.body,
      );
      return sendSuccess(res, experience, { message: "Experience updated." });
    } catch (error) {
      return next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await experienceService.delete(req.params.id as string);
      return sendSuccess(res, null, { message: "Experience deleted." });
    } catch (error) {
      return next(error);
    }
  },
};

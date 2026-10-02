import type { Request, Response, NextFunction } from "express";
import { educationService } from "./education.service.js";
import { sendSuccess } from "../../shared/response.js";

export const educationController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await educationService.list({
        ...(req.query as Record<string, string | number | undefined>),
      });
      return sendSuccess(res, result.items, { meta: result.meta });
    } catch (error) {
      return next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const education = await educationService.getById(req.params.id as string);
      return sendSuccess(res, education);
    } catch (error) {
      return next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const education = await educationService.create(req.body);
      return sendSuccess(res, education, {
        statusCode: 201,
        message: "Education created.",
      });
    } catch (error) {
      return next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const education = await educationService.update(
        req.params.id as string,
        req.body,
      );
      return sendSuccess(res, education, { message: "Education updated." });
    } catch (error) {
      return next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await educationService.delete(req.params.id as string);
      return sendSuccess(res, null, { message: "Education deleted." });
    } catch (error) {
      return next(error);
    }
  },
};

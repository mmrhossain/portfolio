import { Router } from "express";
import { experienceController } from "./experience.controller.js";
import {
  createExperienceSchema,
  experienceIdSchema,
  experienceQuerySchema,
  updateExperienceSchema,
} from "./experience.schemas.js";
import { validate } from "../../middleware/validate.js";
import { authenticate, requireAdmin } from "../../middleware/auth.js";

const experienceRouter = Router();

experienceRouter.get(
  "/",
  validate({ query: experienceQuerySchema }),
  experienceController.list,
);

experienceRouter.use(authenticate, requireAdmin);

experienceRouter.post(
  "/",
  validate({ body: createExperienceSchema }),
  experienceController.create,
);
experienceRouter.get(
  "/:id",
  validate({ params: experienceIdSchema }),
  experienceController.getById,
);
experienceRouter.patch(
  "/:id",
  validate({ params: experienceIdSchema, body: updateExperienceSchema }),
  experienceController.update,
);
experienceRouter.delete(
  "/:id",
  validate({ params: experienceIdSchema }),
  experienceController.delete,
);

export default experienceRouter;

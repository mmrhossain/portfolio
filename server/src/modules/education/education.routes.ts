import { Router } from "express";
import { educationController } from "./education.controller.js";
import {
  createEducationSchema,
  educationIdSchema,
  educationQuerySchema,
  updateEducationSchema,
} from "./education.schemas.js";
import { validate } from "../../middleware/validate.js";
import { authenticate, requireAdmin } from "../../middleware/auth.js";

const educationRouter = Router();

educationRouter.get(
  "/",
  validate({ query: educationQuerySchema }),
  educationController.list,
);

educationRouter.use(authenticate, requireAdmin);

educationRouter.post(
  "/",
  validate({ body: createEducationSchema }),
  educationController.create,
);
educationRouter.get(
  "/:id",
  validate({ params: educationIdSchema }),
  educationController.getById,
);
educationRouter.patch(
  "/:id",
  validate({ params: educationIdSchema, body: updateEducationSchema }),
  educationController.update,
);
educationRouter.delete(
  "/:id",
  validate({ params: educationIdSchema }),
  educationController.delete,
);

export default educationRouter;

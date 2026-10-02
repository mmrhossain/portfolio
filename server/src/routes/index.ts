import { Router } from 'express';
import { env } from "../config/env.js";
import authRouter from "../modules/auth/auth.routes.js";
import usersRouter from "../modules/users/users.routes.js";
import projectsRouter from "../modules/projects/projects.routes.js";
import blogsRouter from "../modules/blogs/blogs.routes.js";
import skillsRouter from "../modules/skills/skills.routes.js";
import experienceRouter from "../modules/experience/experience.routes.js";
import educationRouter from "../modules/education/education.routes.js";
import messagesRouter from "../modules/messages/messages.routes.js";
import settingsRouter from "../modules/settings/settings.routes.js";
import analyticsRouter from "../modules/analytics/analytics.routes.js";
import dashboardRouter from "../modules/dashboard/dashboard.routes.js";

const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      service: 'dev-monir-api',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/projects', projectsRouter);
apiRouter.use('/blogs', blogsRouter);
apiRouter.use('/skills', skillsRouter);
apiRouter.use('/experience', experienceRouter);
apiRouter.use('/education', educationRouter);
apiRouter.use('/messages', messagesRouter);
apiRouter.use('/settings', settingsRouter);
apiRouter.use('/analytics', analyticsRouter);
apiRouter.use('/dashboard', dashboardRouter);

export function mountApiRoutes(app: import('express').Express) {
  app.use(env.API_PREFIX, apiRouter);
}

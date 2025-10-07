import type { Application } from "express";
import { ideasRouter } from "./votes/routes";

export function registerRoutes(app: Application, apiPrefix: string) {
  app.use(apiPrefix, ideasRouter);
}

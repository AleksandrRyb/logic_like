import { Router } from "express";
import { listIdeas, voteIdea } from "./controller";

export const ideasRouter = Router();

ideasRouter.get("/ideas", listIdeas);
ideasRouter.post("/ideas/:id/vote", voteIdea);

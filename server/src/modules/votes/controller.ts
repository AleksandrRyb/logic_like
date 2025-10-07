import type { Request, Response } from "express";
import {
    findIdeaById,
    getClientIp,
    hasAlreadyVoted,
    hasExceededVoteLimit,
    voteForIdea,
    listIdeasWithHasVoted,
} from "./service";
import { ERRORS } from "../../config/constants";
import { logger } from "../../config/logger";

export async function listIdeas(req: Request, res: Response) {
    const result = await listIdeasWithHasVoted(req);
    return res.json(result);
}

export async function voteIdea(req: Request, res: Response) {
    const ideaId = Number(req.params.id);
    if (!Number.isInteger(ideaId) || ideaId <= 0) {
        return res.status(400).json({ error: ERRORS.invalidId });
    }

    try {
        const ip = await getClientIp(req);
        const idea = await findIdeaById(ideaId);
        const exceeded = await hasExceededVoteLimit(ip);
        const already = await hasAlreadyVoted(ip, ideaId);

        if (!idea) {
            return res.status(404).json({ error: ERRORS.notFound });
        }
        if (exceeded) {
            return res.status(409).json({ error: ERRORS.voteLimit });
        }
        if (already) {
            return res.status(409).json({ error: ERRORS.alreadyVoted });
        }
        await voteForIdea(ip, ideaId);
        return res.status(201).json({ ok: true });
    } catch (err: any) {
        if (err && typeof err === "object" && (err as any).code === "23505") {
            return res.status(409).json({ error: ERRORS.alreadyVoted });
        }
        logger.error({ err }, "voteIdea failed");
        return res.status(500).json({ error: ERRORS.failedVote });
    }
}

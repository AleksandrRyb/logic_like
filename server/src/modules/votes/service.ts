import { and, asc, count, desc, eq, sql } from "drizzle-orm";
import { db } from "../../config/db";
import { ideas, votes } from "../../db/schema";
import { UNKNOWN_IP_FALLBACK, MAX_VOTES_PER_IP } from "../../config/constants";

export async function getClientIp(req: {
	headers: Record<string, unknown>;
	ip?: string | string[] | undefined;
}): Promise<string> {
	const xff = req.headers["x-forwarded-for"] as string | string[] | undefined;
	let ip: string | undefined;
	if (Array.isArray(xff)) {
		ip = xff[0];
	} else if (typeof xff === "string") {
		ip = xff.split(",")[0]?.trim();
	}
	if (!ip) {
		const reqIp =
			typeof req.ip === "string"
				? req.ip
				: Array.isArray(req.ip)
					? req.ip[0]
					: undefined;
		ip = reqIp || UNKNOWN_IP_FALLBACK;
	}
	return ip;
}

export async function hasExceededVoteLimit(ip: string): Promise<boolean> {
	const [{ value: total }] = await db
		.select({ value: count() })
		.from(votes)
		.where(eq(votes.ip, ip));
	return total >= MAX_VOTES_PER_IP;
}

export async function hasAlreadyVoted(
	ip: string,
	ideaId: number,
): Promise<boolean> {
	const [{ value: total }] = await db
		.select({ value: count() })
		.from(votes)
		.where(and(eq(votes.ip, ip), eq(votes.ideaId, ideaId)));
	return total > 0;
}

export async function voteForIdea(ip: string, ideaId: number): Promise<void> {
	await db.transaction(async (tx) => {
		await tx.insert(votes).values({ ip, ideaId });
		await tx
			.update(ideas)
			.set({ votesCount: sql`${ideas.votesCount} + 1` })
			.where(eq(ideas.id, ideaId));
	});
}

export async function findIdeaById(ideaId: number) {
	const rows = await db
		.select()
		.from(ideas)
		.where(eq(ideas.id, ideaId))
		.limit(1);
	return rows[0];
}

export async function listIdeasWithHasVoted(req: {
		headers: Record<string, unknown>;
		ip?: string | string[] | undefined;
}): Promise<{ items: Array<{
		id: number;
		title: string;
		description: string;
		votesCount: number;
		createdAt: Date;
		hasVoted: boolean;
	}> }>
{
	const ip = await getClientIp(req);


	const rows = await db
	.select({
		id: ideas.id,
		title: ideas.title,
		description: ideas.description,
		votesCount: ideas.votesCount,
		createdAt: ideas.createdAt,
		hasVoted: sql<boolean>`(${votes.id} IS NOT NULL)`.as("hasVoted"),
	})
	.from(ideas)
	.leftJoin(votes, and(eq(votes.ideaId, ideas.id), eq(votes.ip, ip)))
	.groupBy(ideas.id, ideas.title, ideas.description, ideas.votesCount, ideas.createdAt, votes.id)
	.orderBy(desc(ideas.votesCount), asc(ideas.createdAt));

	return {
		items: rows,
	};
}

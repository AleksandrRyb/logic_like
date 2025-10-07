import { api } from "./client";

export type Idea = {
	id: number;
	title: string;
	description: string;
	votesCount: number;
	createdAt: string;
	hasVoted?: boolean;
};

export type ListIdeasResponse = { items: Idea[] };

export async function listIdeas() {
	const { data } = await api.get<ListIdeasResponse>("/ideas");
	return data;
}

export async function voteIdea(ideaId: number) {
	const { data } = await api.post(`/ideas/${ideaId}/vote`);
	return data as { ok: boolean };
}


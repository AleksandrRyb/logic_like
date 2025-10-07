import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ThumbsUp } from "lucide-react";
import { listIdeas, voteIdea } from "./api/ideas";

export default function App() {
	const qc = useQueryClient();
	const ideasQuery = useQuery({ queryKey: ["ideas"], queryFn: listIdeas });
    const mutation = useMutation({
        mutationFn: (id: number) => voteIdea(id),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["ideas"] });
        },
    });

	if (ideasQuery.isLoading) {
		return (
			<div className="min-h-dvh grid place-items-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-black text-gray-900 dark:text-zinc-100">
				<div className="text-gray-600 dark:text-zinc-400 text-sm">Loading ideas…</div>
			</div>
		);
	}
	if (ideasQuery.isError) {
		return (
			<div className="min-h-dvh grid place-items-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-black text-gray-900 dark:text-zinc-100">
				<div className="text-red-600 dark:text-rose-400 text-sm">
					Error: {(ideasQuery.error as Error).message}
				</div>
			</div>
		);
	}

	const items = ideasQuery.data?.items ?? [];

	return (
		<div className="min-h-dvh grid place-items-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-black text-gray-900 dark:text-zinc-100 px-4">
			<div className="w-full max-w-2xl">
				<div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-6 shadow-xl">
					<div className="text-center">
						<h1 className="text-3xl font-semibold tracking-tight">Logic Like Ideas</h1>
						<p className="mt-1 text-sm text-gray-600 dark:text-zinc-400">
							Vote for what we should build next
						</p>
					</div>

					<ul className="mt-6 space-y-3">
						{items.map((it) => (
							<li
								key={it.id}
								className="group rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-sm p-4 flex items-start justify-between gap-4 transition-shadow hover:shadow-lg"
							>
								<div>
									<div className="font-medium text-base leading-6">
										{it.title}
									</div>
									<p className="text-sm text-gray-600 dark:text-zinc-400 mt-0.5">
										{it.description}
									</p>
								</div>
								<div className="flex items-center gap-3">
									<span className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-zinc-300">
										{it.votesCount} votes
									</span>
                                    <button
                                        disabled={
                                            it.hasVoted ||
                                            (mutation.isPending && mutation.variables === it.id)
                                        }
                                        onClick={() => mutation.mutate(it.id)}
                                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 shadow-sm hover:shadow-md active:translate-y-px transition disabled:opacity-50"
                                    >
										<ThumbsUp size={16} />
                                        {it.hasVoted
                                            ? "Voted"
                                            : mutation.isPending && mutation.variables === it.id
                                            ? "Voting…"
                                            : "Vote"}
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

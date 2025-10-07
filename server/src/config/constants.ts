export const SERVICE_NAME = "logic-like-server" as const;
export const API_PREFIX = "/api" as const;
export const DEFAULT_PORT = 3000 as const;
export const DEFAULT_LOG_LEVEL = "info" as const;
export const UNKNOWN_IP_FALLBACK = "unknown" as const;
export const MAX_VOTES_PER_IP = 10 as const;
export const ERRORS = {
  invalidId: "Invalid idea id",
  notFound: "Idea not found",
  voteLimit: "Vote limit exceeded for this IP",
  alreadyVoted: "Already voted for this idea from this IP",
  failedVote: "Failed to record vote",
  notFoundRoute: "Not Found",
  internal: "Internal Server Error",
} as const;



import {
	pgTable,
	serial,
	text,
	integer,
	timestamp,
	index,
	uniqueIndex,
} from "drizzle-orm/pg-core";

export const ideas = pgTable("ideas", {
	id: serial("id").primaryKey(),
	title: text("title").notNull().unique(),
	description: text("description").notNull(),
	votesCount: integer("votes_count").notNull().default(0),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const votes = pgTable(
	"votes",
	{
		id: serial("id").primaryKey(),
		ideaId: integer("idea_id").notNull(),
		ip: text("ip").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => ({
		ipIdx: index("votes_ip_idx").on(table.ip),
		ideaIdx: index("votes_idea_idx").on(table.ideaId),
		ipIdeaUnique: uniqueIndex("votes_ip_idea_unique").on(
			table.ip,
			table.ideaId,
		),
	}),
);

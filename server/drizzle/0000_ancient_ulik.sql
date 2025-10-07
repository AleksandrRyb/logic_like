CREATE TABLE "ideas" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"votes_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ideas_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"idea_id" integer NOT NULL,
	"ip" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "votes_ip_idx" ON "votes" USING btree ("ip");--> statement-breakpoint
CREATE INDEX "votes_idea_idx" ON "votes" USING btree ("idea_id");--> statement-breakpoint
CREATE UNIQUE INDEX "votes_ip_idea_unique" ON "votes" USING btree ("ip","idea_id");
CREATE TABLE "fund" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fund_analysis" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"fund_id" text NOT NULL,
	"rag_analysis_id" text NOT NULL,
	"title" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fund_analysis" ADD CONSTRAINT "fund_analysis_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fund_analysis" ADD CONSTRAINT "fund_analysis_fund_id_fund_id_fk" FOREIGN KEY ("fund_id") REFERENCES "public"."fund"("id") ON DELETE cascade ON UPDATE no action;
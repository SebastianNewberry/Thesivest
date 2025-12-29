CREATE TABLE "certification" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"organization" text NOT NULL,
	"issue_date" timestamp NOT NULL,
	"expiration_date" timestamp,
	"credential_id" text,
	"credential_url" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"school" text NOT NULL,
	"degree" text NOT NULL,
	"field" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"current" boolean DEFAULT false,
	"gpa" text,
	"honors" text,
	"activities" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "sell_price" numeric;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "sell_date" timestamp;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "exit_thoughts" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "username" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "location" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "website" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "linkedin" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "twitter" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "seeking_employment" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "available_for_hire" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "certification" ADD CONSTRAINT "certification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education" ADD CONSTRAINT "education_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");
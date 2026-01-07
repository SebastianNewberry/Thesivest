CREATE TABLE "stock_analysis" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"symbol" text NOT NULL,
	"rag_analysis_id" text NOT NULL,
	"title" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stock_analysis" ADD CONSTRAINT "stock_analysis_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_analysis" ADD CONSTRAINT "stock_analysis_symbol_stock_symbol_fk" FOREIGN KEY ("symbol") REFERENCES "public"."stock"("symbol") ON DELETE cascade ON UPDATE no action;
CREATE TABLE "faucet_claims" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"chain_id" integer NOT NULL,
	"token" text NOT NULL,
	"amount" text NOT NULL,
	"tx_hash" text NOT NULL,
	"ip_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "linked_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"username" text,
	"verified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"expires_at" timestamp with time zone NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"wallet_address" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
ALTER TABLE "faucet_claims" ADD CONSTRAINT "faucet_claims_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "linked_accounts" ADD CONSTRAINT "linked_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "claims_user_created_idx" ON "faucet_claims" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "claims_ip_created_idx" ON "faucet_claims" USING btree ("ip_hash","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "linked_provider_account_uq" ON "linked_accounts" USING btree ("provider","provider_account_id");--> statement-breakpoint
CREATE INDEX "linked_user_idx" ON "linked_accounts" USING btree ("user_id");
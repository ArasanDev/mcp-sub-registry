CREATE TYPE "public"."curation_status" AS ENUM('pending', 'approved', 'rejected', 'hidden');--> statement-breakpoint
CREATE TYPE "public"."curation_visibility" AS ENUM('public', 'private', 'unlisted');--> statement-breakpoint
CREATE TYPE "public"."registry_source_type" AS ENUM('official', 'subregistry', 'manual', 'other');--> statement-breakpoint
CREATE TYPE "public"."server_status" AS ENUM('indexed', 'invalid', 'removed_upstream');--> statement-breakpoint
CREATE TYPE "public"."sync_mode" AS ENUM('full_etl', 'incremental', 'latest_only');--> statement-breakpoint
CREATE TYPE "public"."sync_status" AS ENUM('running', 'succeeded', 'failed');--> statement-breakpoint
CREATE TYPE "public"."tool_source" AS ENUM('manual', 'discovered', 'upstream');--> statement-breakpoint
CREATE TYPE "public"."upstream_status" AS ENUM('active', 'deprecated', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."server_version_status" AS ENUM('indexed', 'removed_upstream', 'invalid');--> statement-breakpoint
CREATE TABLE "curations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "curations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"server_id" integer NOT NULL,
	"server_version_id" integer,
	"status" "curation_status" DEFAULT 'pending' NOT NULL,
	"visibility" "curation_visibility" DEFAULT 'private' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"quality_label" text,
	"notes" text,
	"meta" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "registry_sources" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "registry_sources_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"type" "registry_source_type" NOT NULL,
	"base_url" text,
	"enabled" boolean DEFAULT true NOT NULL,
	"last_synced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "server_packages" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "server_packages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"server_version_id" integer NOT NULL,
	"registry_type" text NOT NULL,
	"identifier" text NOT NULL,
	"version" text,
	"transport" jsonb,
	"runtime_hint" text,
	"registry_base_url" text,
	"file_sha256" text,
	"package_arguments" jsonb,
	"runtime_arguments" jsonb,
	"environment_variables" jsonb,
	"package_json" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "server_remotes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "server_remotes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"server_version_id" integer NOT NULL,
	"transport_type" text NOT NULL,
	"url" text NOT NULL,
	"headers" jsonb,
	"variables" jsonb,
	"remote_json" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "server_tags" (
	"server_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "server_tags_server_id_tag_id_pk" PRIMARY KEY("server_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "server_tools" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "server_tools_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"server_version_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"input_schema" jsonb,
	"output_schema" jsonb,
	"source" "tool_source" DEFAULT 'manual' NOT NULL,
	"discovered_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "server_versions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "server_versions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"server_id" integer NOT NULL,
	"source_id" integer NOT NULL,
	"version" text NOT NULL,
	"raw_json" jsonb NOT NULL,
	"normalized_json" jsonb NOT NULL,
	"upstream_status" "upstream_status",
	"status" "server_version_status" DEFAULT 'indexed' NOT NULL,
	"published_at" timestamp with time zone,
	"upstream_updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "servers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "servers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"title" text,
	"description" text,
	"website_url" text,
	"repository_url" text,
	"license" text,
	"status" "server_status" DEFAULT 'indexed' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sync_runs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sync_runs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"source_id" integer NOT NULL,
	"mode" "sync_mode" NOT NULL,
	"status" "sync_status" NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"cursor" text,
	"updated_since" timestamp with time zone,
	"servers_seen" integer DEFAULT 0 NOT NULL,
	"versions_seen" integer DEFAULT 0 NOT NULL,
	"error" text
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tags_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "curations" ADD CONSTRAINT "curations_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curations" ADD CONSTRAINT "curations_server_version_id_server_versions_id_fk" FOREIGN KEY ("server_version_id") REFERENCES "public"."server_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_packages" ADD CONSTRAINT "server_packages_server_version_id_server_versions_id_fk" FOREIGN KEY ("server_version_id") REFERENCES "public"."server_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_remotes" ADD CONSTRAINT "server_remotes_server_version_id_server_versions_id_fk" FOREIGN KEY ("server_version_id") REFERENCES "public"."server_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_tags" ADD CONSTRAINT "server_tags_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_tags" ADD CONSTRAINT "server_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_tools" ADD CONSTRAINT "server_tools_server_version_id_server_versions_id_fk" FOREIGN KEY ("server_version_id") REFERENCES "public"."server_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_versions" ADD CONSTRAINT "server_versions_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_versions" ADD CONSTRAINT "server_versions_source_id_registry_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."registry_sources"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_runs" ADD CONSTRAINT "sync_runs_source_id_registry_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."registry_sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "curations_server_level_idx" ON "curations" USING btree ("server_id") WHERE "server_version_id" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "curations_version_level_idx" ON "curations" USING btree ("server_id","server_version_id") WHERE "server_version_id" is not null;--> statement-breakpoint
CREATE INDEX "curations_status_visibility_idx" ON "curations" USING btree ("status","visibility");--> statement-breakpoint
CREATE UNIQUE INDEX "registry_sources_name_idx" ON "registry_sources" USING btree ("name");--> statement-breakpoint
CREATE INDEX "server_packages_version_idx" ON "server_packages" USING btree ("server_version_id");--> statement-breakpoint
CREATE INDEX "server_packages_registry_type_idx" ON "server_packages" USING btree ("registry_type");--> statement-breakpoint
CREATE INDEX "server_remotes_version_idx" ON "server_remotes" USING btree ("server_version_id");--> statement-breakpoint
CREATE INDEX "server_remotes_transport_type_idx" ON "server_remotes" USING btree ("transport_type");--> statement-breakpoint
CREATE INDEX "server_tags_tag_idx" ON "server_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "server_tools_version_name_idx" ON "server_tools" USING btree ("server_version_id","name");--> statement-breakpoint
CREATE INDEX "server_tools_name_idx" ON "server_tools" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "server_versions_identity_idx" ON "server_versions" USING btree ("server_id","source_id","version");--> statement-breakpoint
CREATE INDEX "server_versions_server_idx" ON "server_versions" USING btree ("server_id");--> statement-breakpoint
CREATE INDEX "server_versions_status_idx" ON "server_versions" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "servers_name_idx" ON "servers" USING btree ("name");--> statement-breakpoint
CREATE INDEX "servers_status_idx" ON "servers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "sync_runs_source_idx" ON "sync_runs" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "sync_runs_status_idx" ON "sync_runs" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
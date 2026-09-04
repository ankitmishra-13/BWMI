CREATE TABLE `admin_assistant_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`admin_id` text NOT NULL,
	`application_id` text,
	`state_code` text,
	`context_type` text NOT NULL,
	`question_length` integer NOT NULL,
	`used_fallback` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `admin_assistant_rate_limit_idx` ON `admin_assistant_requests` (`admin_id`,`created_at`);--> statement-breakpoint
ALTER TABLE `renewal_applications` ADD `state_code` text DEFAULT 'DL' NOT NULL;--> statement-breakpoint
ALTER TABLE `renewal_applications` ADD `district_name` text DEFAULT 'New Delhi' NOT NULL;--> statement-breakpoint
ALTER TABLE `renewal_applications` ADD `rto_code` text DEFAULT 'DL-01' NOT NULL;--> statement-breakpoint
ALTER TABLE `renewal_applications` ADD `assigned_admin_id` text DEFAULT 'demo-admin-bwmi-2026' NOT NULL;--> statement-breakpoint
ALTER TABLE `renewal_applications` ADD `priority` text DEFAULT 'Normal' NOT NULL;--> statement-breakpoint
ALTER TABLE `renewal_applications` ADD `sla_due_at` text;--> statement-breakpoint
ALTER TABLE `renewal_applications` ADD `last_citizen_update_at` text;--> statement-breakpoint
CREATE INDEX `application_region_idx` ON `renewal_applications` (`state_code`,`rto_code`);--> statement-breakpoint
CREATE INDEX `application_sla_idx` ON `renewal_applications` (`sla_due_at`);
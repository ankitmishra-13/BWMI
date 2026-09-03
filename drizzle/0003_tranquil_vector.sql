CREATE TABLE `citizen_preferences` (
	`user_id` text PRIMARY KEY NOT NULL,
	`large_text` integer DEFAULT false NOT NULL,
	`high_contrast` integer DEFAULT false NOT NULL,
	`reduced_motion` integer DEFAULT false NOT NULL,
	`low_bandwidth` integer DEFAULT false NOT NULL,
	`simplified_guidance` integer DEFAULT false NOT NULL,
	`read_aloud` integer DEFAULT false NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `readiness_assessments` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`age_band` text NOT NULL,
	`licence_type` text NOT NULL,
	`expiry_situation` text NOT NULL,
	`issue_state` text NOT NULL,
	`address_changed` integer DEFAULT false NOT NULL,
	`service_preference` text DEFAULT 'standard' NOT NULL,
	`preferred_locale` text DEFAULT 'en' NOT NULL,
	`readiness_status` text NOT NULL,
	`medical_required` integer DEFAULT false NOT NULL,
	`visit_expected` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `readiness_user_idx` ON `readiness_assessments` (`user_id`);--> statement-breakpoint
CREATE INDEX `readiness_created_idx` ON `readiness_assessments` (`created_at`);--> statement-breakpoint
CREATE TABLE `recovery_events` (
	`id` text PRIMARY KEY NOT NULL,
	`application_id` text NOT NULL,
	`user_id` text NOT NULL,
	`event_type` text NOT NULL,
	`detail` text NOT NULL,
	`resolved` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`resolved_at` text
);
--> statement-breakpoint
CREATE INDEX `recovery_application_idx` ON `recovery_events` (`application_id`);--> statement-breakpoint
CREATE INDEX `recovery_user_idx` ON `recovery_events` (`user_id`);--> statement-breakpoint
ALTER TABLE `renewal_applications` ADD `readiness_assessment_id` text;
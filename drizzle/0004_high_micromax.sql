CREATE TABLE `admin_audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`admin_id` text NOT NULL,
	`application_id` text NOT NULL,
	`previous_status` text NOT NULL,
	`next_status` text NOT NULL,
	`progress_percent` integer NOT NULL,
	`citizen_message` text NOT NULL,
	`whatsapp_queued` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `admin_audit_application_idx` ON `admin_audit_logs` (`application_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `admin_audit_admin_idx` ON `admin_audit_logs` (`admin_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`application_id` text NOT NULL,
	`title_en` text NOT NULL,
	`title_hi` text NOT NULL,
	`body_en` text NOT NULL,
	`body_hi` text NOT NULL,
	`event_type` text NOT NULL,
	`channel` text DEFAULT 'In-app' NOT NULL,
	`read` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `notification_user_idx` ON `notifications` (`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `notification_application_idx` ON `notifications` (`application_id`);--> statement-breakpoint
ALTER TABLE `profiles` ADD `digilocker_linked` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `profiles` ADD `digilocker_linked_at` text;--> statement-breakpoint
ALTER TABLE `profiles` ADD `onboarding_completed` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `renewal_applications` ADD `progress_percent` integer DEFAULT 10 NOT NULL;
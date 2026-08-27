CREATE TABLE `application_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`application_id` text NOT NULL,
	`user_id` text NOT NULL,
	`document_type` text NOT NULL,
	`file_name` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`verification_status` text DEFAULT 'Mock selected' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `document_application_idx` ON `application_documents` (`application_id`);--> statement-breakpoint
CREATE INDEX `document_user_idx` ON `application_documents` (`user_id`);--> statement-breakpoint
CREATE TABLE `assistant_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`application_id` text NOT NULL,
	`step` integer NOT NULL,
	`question_length` integer NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `assistant_rate_limit_idx` ON `assistant_requests` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `driver_licences` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`masked_number` text NOT NULL,
	`holder_name` text NOT NULL,
	`date_of_birth` text NOT NULL,
	`valid_until` text NOT NULL,
	`issue_state` text NOT NULL,
	`vehicle_classes` text NOT NULL,
	`address` text NOT NULL,
	`eligible` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `licence_user_idx` ON `driver_licences` (`user_id`);--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`application_id` text NOT NULL,
	`user_id` text NOT NULL,
	`amount_paise` integer NOT NULL,
	`state` text DEFAULT 'Mock successful' NOT NULL,
	`transaction_reference` text NOT NULL,
	`paid_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_application_idx` ON `payments` (`application_id`);--> statement-breakpoint
CREATE INDEX `payment_user_idx` ON `payments` (`user_id`);--> statement-breakpoint
CREATE TABLE `profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`full_name` text NOT NULL,
	`preferred_locale` text DEFAULT 'en' NOT NULL,
	`synthetic_phone` text DEFAULT '+91 ••••• 78120' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `renewal_applications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`licence_id` text NOT NULL,
	`current_step` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'Draft' NOT NULL,
	`contact_email` text NOT NULL,
	`contact_phone` text NOT NULL,
	`address` text NOT NULL,
	`declarations_accepted` integer DEFAULT false NOT NULL,
	`fee_paise` integer DEFAULT 45000 NOT NULL,
	`submitted_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `application_user_idx` ON `renewal_applications` (`user_id`);--> statement-breakpoint
CREATE INDEX `application_status_idx` ON `renewal_applications` (`status`);--> statement-breakpoint
CREATE TABLE `status_events` (
	`id` text PRIMARY KEY NOT NULL,
	`application_id` text NOT NULL,
	`user_id` text NOT NULL,
	`event_type` text NOT NULL,
	`title_en` text NOT NULL,
	`title_hi` text NOT NULL,
	`description_en` text NOT NULL,
	`description_hi` text NOT NULL,
	`position` integer NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `event_application_idx` ON `status_events` (`application_id`);--> statement-breakpoint
CREATE INDEX `event_user_idx` ON `status_events` (`user_id`);
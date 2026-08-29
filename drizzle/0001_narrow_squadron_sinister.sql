CREATE TABLE `service_applications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`service_slug` text NOT NULL,
	`category` text NOT NULL,
	`current_step` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'Draft' NOT NULL,
	`selection` text,
	`reference` text,
	`fee_paise` integer DEFAULT 0 NOT NULL,
	`submitted_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `service_application_user_idx` ON `service_applications` (`user_id`);--> statement-breakpoint
CREATE INDEX `service_application_slug_idx` ON `service_applications` (`service_slug`);
ALTER TABLE `payments` ADD `method` text DEFAULT 'mock-upi' NOT NULL;--> statement-breakpoint
ALTER TABLE `service_applications` ADD `contact_email` text DEFAULT 'citizen.demo@bwmi.test' NOT NULL;--> statement-breakpoint
ALTER TABLE `service_applications` ADD `contact_phone` text DEFAULT '+91 98765 78120' NOT NULL;--> statement-breakpoint
ALTER TABLE `service_applications` ADD `address` text DEFAULT '24 Sample Marg, New Delhi 110001' NOT NULL;--> statement-breakpoint
ALTER TABLE `service_applications` ADD `request_value` text DEFAULT 'Synthetic service request' NOT NULL;--> statement-breakpoint
ALTER TABLE `service_applications` ADD `request_reason` text DEFAULT 'Citizen record update' NOT NULL;--> statement-breakpoint
ALTER TABLE `service_applications` ADD `declarations_accepted` integer DEFAULT false NOT NULL;
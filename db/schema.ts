import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const profiles = sqliteTable('profiles', {
  userId: text('user_id').primaryKey(),
  email: text('email').notNull(),
  fullName: text('full_name').notNull(),
  preferredLocale: text('preferred_locale').notNull().default('en'),
  syntheticPhone: text('synthetic_phone').notNull().default('+91 ••••• 78120'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const driverLicences = sqliteTable(
  'driver_licences',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    maskedNumber: text('masked_number').notNull(),
    holderName: text('holder_name').notNull(),
    dateOfBirth: text('date_of_birth').notNull(),
    validUntil: text('valid_until').notNull(),
    issueState: text('issue_state').notNull(),
    vehicleClasses: text('vehicle_classes').notNull(),
    address: text('address').notNull(),
    eligible: integer('eligible', { mode: 'boolean' }).notNull().default(true),
    createdAt: text('created_at').notNull(),
  },
  (table) => [uniqueIndex('licence_user_idx').on(table.userId)],
);

export const renewalApplications = sqliteTable(
  'renewal_applications',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    licenceId: text('licence_id').notNull(),
    currentStep: integer('current_step').notNull().default(0),
    status: text('status').notNull().default('Draft'),
    contactEmail: text('contact_email').notNull(),
    contactPhone: text('contact_phone').notNull(),
    address: text('address').notNull(),
    declarationsAccepted: integer('declarations_accepted', { mode: 'boolean' }).notNull().default(false),
    feePaise: integer('fee_paise').notNull().default(45000),
    submittedAt: text('submitted_at'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [
    index('application_user_idx').on(table.userId),
    index('application_status_idx').on(table.status),
  ],
);

export const applicationDocuments = sqliteTable(
  'application_documents',
  {
    id: text('id').primaryKey(),
    applicationId: text('application_id').notNull(),
    userId: text('user_id').notNull(),
    documentType: text('document_type').notNull(),
    fileName: text('file_name').notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    verificationStatus: text('verification_status').notNull().default('Mock selected'),
    createdAt: text('created_at').notNull(),
  },
  (table) => [
    index('document_application_idx').on(table.applicationId),
    index('document_user_idx').on(table.userId),
  ],
);

export const payments = sqliteTable(
  'payments',
  {
    id: text('id').primaryKey(),
    applicationId: text('application_id').notNull(),
    userId: text('user_id').notNull(),
    amountPaise: integer('amount_paise').notNull(),
    state: text('state').notNull().default('Mock successful'),
    transactionReference: text('transaction_reference').notNull(),
    paidAt: text('paid_at').notNull(),
  },
  (table) => [
    uniqueIndex('payment_application_idx').on(table.applicationId),
    index('payment_user_idx').on(table.userId),
  ],
);

export const statusEvents = sqliteTable(
  'status_events',
  {
    id: text('id').primaryKey(),
    applicationId: text('application_id').notNull(),
    userId: text('user_id').notNull(),
    eventType: text('event_type').notNull(),
    titleEn: text('title_en').notNull(),
    titleHi: text('title_hi').notNull(),
    descriptionEn: text('description_en').notNull(),
    descriptionHi: text('description_hi').notNull(),
    position: integer('position').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (table) => [
    index('event_application_idx').on(table.applicationId),
    index('event_user_idx').on(table.userId),
  ],
);

export const assistantRequests = sqliteTable(
  'assistant_requests',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    applicationId: text('application_id').notNull(),
    step: integer('step').notNull(),
    questionLength: integer('question_length').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (table) => [index('assistant_rate_limit_idx').on(table.userId, table.createdAt)],
);

export type DriverLicence = typeof driverLicences.$inferSelect;
export type RenewalApplication = typeof renewalApplications.$inferSelect;
export type ApplicationDocument = typeof applicationDocuments.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type StatusEvent = typeof statusEvents.$inferSelect;

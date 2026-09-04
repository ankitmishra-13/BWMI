import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const profiles = sqliteTable('profiles', {
  userId: text('user_id').primaryKey(),
  email: text('email').notNull(),
  fullName: text('full_name').notNull(),
  preferredLocale: text('preferred_locale').notNull().default('en'),
  syntheticPhone: text('synthetic_phone').notNull().default('+91 ••••• 78120'),
  digilockerLinked: integer('digilocker_linked', { mode: 'boolean' }).notNull().default(false),
  digilockerLinkedAt: text('digilocker_linked_at'),
  onboardingCompleted: integer('onboarding_completed', { mode: 'boolean' }).notNull().default(false),
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
    readinessAssessmentId: text('readiness_assessment_id'),
    currentStep: integer('current_step').notNull().default(0),
    status: text('status').notNull().default('Draft'),
    progressPercent: integer('progress_percent').notNull().default(10),
    stateCode: text('state_code').notNull().default('DL'),
    districtName: text('district_name').notNull().default('New Delhi'),
    rtoCode: text('rto_code').notNull().default('DL-01'),
    assignedAdminId: text('assigned_admin_id').notNull().default('demo-admin-bwmi-2026'),
    priority: text('priority').notNull().default('Normal'),
    slaDueAt: text('sla_due_at'),
    lastCitizenUpdateAt: text('last_citizen_update_at'),
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
    index('application_region_idx').on(table.stateCode, table.rtoCode),
    index('application_sla_idx').on(table.slaDueAt),
  ],
);

export const readinessAssessments = sqliteTable(
  'readiness_assessments',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    ageBand: text('age_band').notNull(),
    licenceType: text('licence_type').notNull(),
    expirySituation: text('expiry_situation').notNull(),
    issueState: text('issue_state').notNull(),
    addressChanged: integer('address_changed', { mode: 'boolean' }).notNull().default(false),
    servicePreference: text('service_preference').notNull().default('standard'),
    preferredLocale: text('preferred_locale').notNull().default('en'),
    readinessStatus: text('readiness_status').notNull(),
    medicalRequired: integer('medical_required', { mode: 'boolean' }).notNull().default(false),
    visitExpected: integer('visit_expected', { mode: 'boolean' }).notNull().default(false),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [
    index('readiness_user_idx').on(table.userId),
    index('readiness_created_idx').on(table.createdAt),
  ],
);

export const citizenPreferences = sqliteTable('citizen_preferences', {
  userId: text('user_id').primaryKey(),
  largeText: integer('large_text', { mode: 'boolean' }).notNull().default(false),
  highContrast: integer('high_contrast', { mode: 'boolean' }).notNull().default(false),
  reducedMotion: integer('reduced_motion', { mode: 'boolean' }).notNull().default(false),
  lowBandwidth: integer('low_bandwidth', { mode: 'boolean' }).notNull().default(false),
  simplifiedGuidance: integer('simplified_guidance', { mode: 'boolean' }).notNull().default(false),
  readAloud: integer('read_aloud', { mode: 'boolean' }).notNull().default(false),
  updatedAt: text('updated_at').notNull(),
});

export const recoveryEvents = sqliteTable(
  'recovery_events',
  {
    id: text('id').primaryKey(),
    applicationId: text('application_id').notNull(),
    userId: text('user_id').notNull(),
    eventType: text('event_type').notNull(),
    detail: text('detail').notNull(),
    resolved: integer('resolved', { mode: 'boolean' }).notNull().default(false),
    createdAt: text('created_at').notNull(),
    resolvedAt: text('resolved_at'),
  },
  (table) => [
    index('recovery_application_idx').on(table.applicationId),
    index('recovery_user_idx').on(table.userId),
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
    method: text('method').notNull().default('mock-upi'),
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

export const notifications = sqliteTable(
  'notifications',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    applicationId: text('application_id').notNull(),
    titleEn: text('title_en').notNull(),
    titleHi: text('title_hi').notNull(),
    bodyEn: text('body_en').notNull(),
    bodyHi: text('body_hi').notNull(),
    eventType: text('event_type').notNull(),
    channel: text('channel').notNull().default('In-app'),
    read: integer('read', { mode: 'boolean' }).notNull().default(false),
    createdAt: text('created_at').notNull(),
  },
  (table) => [
    index('notification_user_idx').on(table.userId, table.createdAt),
    index('notification_application_idx').on(table.applicationId),
  ],
);

export const adminAuditLogs = sqliteTable(
  'admin_audit_logs',
  {
    id: text('id').primaryKey(),
    adminId: text('admin_id').notNull(),
    applicationId: text('application_id').notNull(),
    previousStatus: text('previous_status').notNull(),
    nextStatus: text('next_status').notNull(),
    progressPercent: integer('progress_percent').notNull(),
    citizenMessage: text('citizen_message').notNull(),
    whatsappQueued: integer('whatsapp_queued', { mode: 'boolean' }).notNull().default(true),
    createdAt: text('created_at').notNull(),
  },
  (table) => [
    index('admin_audit_application_idx').on(table.applicationId, table.createdAt),
    index('admin_audit_admin_idx').on(table.adminId, table.createdAt),
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

export const adminAssistantRequests = sqliteTable(
  'admin_assistant_requests',
  {
    id: text('id').primaryKey(),
    adminId: text('admin_id').notNull(),
    applicationId: text('application_id'),
    stateCode: text('state_code'),
    contextType: text('context_type').notNull(),
    questionLength: integer('question_length').notNull(),
    usedFallback: integer('used_fallback', { mode: 'boolean' }).notNull().default(false),
    createdAt: text('created_at').notNull(),
  },
  (table) => [index('admin_assistant_rate_limit_idx').on(table.adminId, table.createdAt)],
);

export const serviceApplications = sqliteTable(
  'service_applications',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    serviceSlug: text('service_slug').notNull(),
    category: text('category').notNull(),
    currentStep: integer('current_step').notNull().default(0),
    status: text('status').notNull().default('Draft'),
    selection: text('selection'),
    contactEmail: text('contact_email').notNull().default('citizen.demo@bwmi.test'),
    contactPhone: text('contact_phone').notNull().default('+91 98765 78120'),
    address: text('address').notNull().default('24 Sample Marg, New Delhi 110001'),
    requestValue: text('request_value').notNull().default('Synthetic service request'),
    requestReason: text('request_reason').notNull().default('Citizen record update'),
    declarationsAccepted: integer('declarations_accepted', { mode: 'boolean' }).notNull().default(false),
    reference: text('reference'),
    feePaise: integer('fee_paise').notNull().default(0),
    submittedAt: text('submitted_at'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [
    index('service_application_user_idx').on(table.userId),
    index('service_application_slug_idx').on(table.serviceSlug),
  ],
);

export type DriverLicence = typeof driverLicences.$inferSelect;
export type RenewalApplication = typeof renewalApplications.$inferSelect;
export type ReadinessAssessment = typeof readinessAssessments.$inferSelect;
export type CitizenPreference = typeof citizenPreferences.$inferSelect;
export type RecoveryEvent = typeof recoveryEvents.$inferSelect;
export type ApplicationDocument = typeof applicationDocuments.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type StatusEvent = typeof statusEvents.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type AdminAuditLog = typeof adminAuditLogs.$inferSelect;
export type AdminAssistantRequest = typeof adminAssistantRequests.$inferSelect;
export type ServiceApplication = typeof serviceApplications.$inferSelect;

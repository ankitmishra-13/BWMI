import { and, count, desc, eq, gte } from 'drizzle-orm';
import type { ChatGPTUser } from '@/app/chatgpt-auth';
import { getDb } from '@/db';
import {
  adminAuditLogs,
  applicationDocuments,
  assistantRequests,
  citizenPreferences,
  driverLicences,
  payments,
  profiles,
  notifications,
  readinessAssessments,
  recoveryEvents,
  renewalApplications,
  serviceApplications,
  statusEvents,
  type ApplicationDocument,
  type DriverLicence,
  type Payment,
  type ReadinessAssessment,
  type RecoveryEvent,
  type RenewalApplication,
  type ServiceApplication,
  type StatusEvent,
} from '@/db/schema';
import type { Locale } from '@/lib/i18n';
import { evaluateReadiness } from '@/lib/readiness';
import type { TransportService } from '@/lib/services';
import type { AdminStatusUpdateInput, ApplicationUpdate, CitizenPreferenceInput, MockPaymentMethod, ReadinessInput, RecoveryEventInput, ServiceApplicationUpdate } from '@/lib/validation';

export type ApplicationBundle = {
  application: RenewalApplication;
  licence: DriverLicence;
  documents: ApplicationDocument[];
  payment: Payment | null;
  events: StatusEvent[];
  readiness: ReadinessAssessment | null;
  recoveryEvents: RecoveryEvent[];
};

export const defaultCitizenPreferences: CitizenPreferenceInput = {
  largeText: false,
  highContrast: false,
  reducedMotion: false,
  lowBandwidth: false,
  simplifiedGuidance: false,
  readAloud: false,
};

const now = () => new Date().toISOString();

export async function ensureSyntheticCitizen(user: ChatGPTUser, locale: Locale, onboarding?: { syntheticPhone?: string; digilockerLinked?: boolean }) {
  const db = getDb();
  const timestamp = now();
  const syntheticName = user.fullName || 'Aarav Sharma';
  const syntheticEmail = user.email.toLowerCase().endsWith('@bwmi.test') ? user.email : 'citizen.demo@bwmi.test';
  const digilockerLinked = onboarding?.digilockerLinked === true;
  await db.insert(profiles).values({
    userId: user.userId, email: syntheticEmail, fullName: syntheticName,
    preferredLocale: locale, syntheticPhone: onboarding?.syntheticPhone || '+91 98765 78120',
    digilockerLinked, digilockerLinkedAt: digilockerLinked ? timestamp : null,
    onboardingCompleted: digilockerLinked, createdAt: timestamp, updatedAt: timestamp,
  }).onConflictDoUpdate({
    target: profiles.userId,
    set: onboarding ? {
      email: syntheticEmail, fullName: syntheticName, preferredLocale: locale,
      syntheticPhone: onboarding.syntheticPhone || '+91 98765 78120',
      digilockerLinked, digilockerLinkedAt: digilockerLinked ? timestamp : null,
      onboardingCompleted: digilockerLinked, updatedAt: timestamp,
    } : { preferredLocale: locale, updatedAt: timestamp },
  });

  await db.insert(driverLicences).values({
    id: crypto.randomUUID(), userId: user.userId, maskedNumber: 'DL-••-2014-••7812',
    holderName: syntheticName, dateOfBirth: '1992-08-14', validUntil: '2026-09-18',
    issueState: 'Delhi', vehicleClasses: 'LMV, MCWG', address: '24 Sample Marg, New Delhi 110001',
    eligible: true, createdAt: timestamp,
  }).onConflictDoNothing({ target: driverLicences.userId });
}

export async function getCitizenProfile(userId: string) {
  const [profile] = await getDb().select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return profile ?? null;
}

export async function updateSyntheticProfile(userId: string, input: { fullName: string; email: string; syntheticPhone: string; preferredLocale: Locale }) {
  const timestamp = now();
  await getDb().update(profiles).set({ ...input, updatedAt: timestamp }).where(eq(profiles.userId, userId));
  return getCitizenProfile(userId);
}

export async function getCitizenPreferences(userId: string): Promise<CitizenPreferenceInput> {
  const [preferences] = await getDb().select().from(citizenPreferences).where(eq(citizenPreferences.userId, userId)).limit(1);
  if (!preferences) return defaultCitizenPreferences;
  return {
    largeText: preferences.largeText,
    highContrast: preferences.highContrast,
    reducedMotion: preferences.reducedMotion,
    lowBandwidth: preferences.lowBandwidth,
    simplifiedGuidance: preferences.simplifiedGuidance,
    readAloud: preferences.readAloud,
  };
}

export async function updateCitizenPreferences(userId: string, input: CitizenPreferenceInput): Promise<CitizenPreferenceInput> {
  const updatedAt = now();
  await getDb().insert(citizenPreferences).values({ userId, ...input, updatedAt }).onConflictDoUpdate({
    target: citizenPreferences.userId,
    set: { ...input, updatedAt },
  });
  return getCitizenPreferences(userId);
}

export async function getCitizenWorkspace(userId: string) {
  const db = getDb();
  const [licence] = await db.select().from(driverLicences).where(eq(driverLicences.userId, userId)).limit(1);
  const applications = await db.select().from(renewalApplications)
    .where(eq(renewalApplications.userId, userId)).orderBy(desc(renewalApplications.createdAt));
  const otherApplications = await db.select().from(serviceApplications)
    .where(eq(serviceApplications.userId, userId)).orderBy(desc(serviceApplications.createdAt));
  return { licence, applications, otherApplications };
}

export async function createServiceApplication(userId: string, service: TransportService): Promise<ServiceApplication> {
  const db = getDb();
  const timestamp = now();
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  const [licence] = await db.select().from(driverLicences).where(eq(driverLicences.userId, userId)).limit(1);
  if (!profile || !licence) throw new Error('Synthetic citizen profile is unavailable.');
  const application: ServiceApplication = {
    id: crypto.randomUUID(),
    userId,
    serviceSlug: service.slug,
    category: service.category,
    currentStep: 0,
    status: 'Draft',
    selection: 'standard',
    contactEmail: profile.email,
    contactPhone: profile.syntheticPhone,
    address: licence.address,
    requestValue: defaultServiceRequestValue(service),
    requestReason: 'Citizen record update',
    declarationsAccepted: false,
    reference: null,
    feePaise: service.feePaise ?? 0,
    submittedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  await db.insert(serviceApplications).values(application);
  return application;
}

export async function getServiceApplication(userId: string, applicationId: string): Promise<ServiceApplication | null> {
  const db = getDb();
  const [application] = await db.select().from(serviceApplications)
    .where(and(eq(serviceApplications.id, applicationId), eq(serviceApplications.userId, userId))).limit(1);
  return application ?? null;
}

export async function getServicePayment(userId: string, applicationId: string): Promise<Payment | null> {
  const [payment] = await getDb().select().from(payments)
    .where(and(eq(payments.applicationId, applicationId), eq(payments.userId, userId))).limit(1);
  return payment ?? null;
}

export async function applyServiceApplicationUpdate(userId: string, applicationId: string, update: ServiceApplicationUpdate): Promise<ServiceApplication | null> {
  const existing = await getServiceApplication(userId, applicationId);
  if (!existing) return null;
  if (existing.status !== 'Draft') return existing;
  if (update.step > existing.currentStep) throw new Error('Complete the current step first.');
  const timestamp = now();
  if (update.step === 4) return completeServiceApplication(userId, applicationId, update.data.paymentMethod);
  const values: Partial<ServiceApplication> = { currentStep: Math.max(existing.currentStep, update.step + 1), updatedAt: timestamp };
  if (update.step === 1) Object.assign(values, update.data);
  if (update.step === 3) values.declarationsAccepted = true;
  await getDb().update(serviceApplications).set(values).where(and(eq(serviceApplications.id, applicationId), eq(serviceApplications.userId, userId)));
  return getServiceApplication(userId, applicationId);
}

export async function completeServiceApplication(userId: string, applicationId: string, paymentMethod: MockPaymentMethod): Promise<ServiceApplication | null> {
  const existing = await getServiceApplication(userId, applicationId);
  if (!existing) return null;
  if (existing.status !== 'Draft') return existing;
  if (!existing.declarationsAccepted || existing.currentStep < 4) throw new Error('Review the application before payment.');
  const timestamp = now();
  const reference = `RAAHI-${existing.serviceSlug.slice(0, 4).toUpperCase()}-${timestamp.slice(2, 10).replaceAll('-', '')}-${applicationId.slice(0, 5).toUpperCase()}`;
  const transactionReference = `MOCK-PAY-${timestamp.slice(2, 10).replaceAll('-', '')}-${applicationId.slice(0, 6).toUpperCase()}`;
  await getDb().insert(payments).values({
    id: crypto.randomUUID(), applicationId, userId, amountPaise: existing.feePaise,
    state: 'Mock successful', method: paymentMethod, transactionReference, paidAt: timestamp,
  }).onConflictDoNothing({ target: payments.applicationId });
  await getDb().update(serviceApplications).set({
    currentStep: 5,
    status: 'Submitted',
    reference,
    submittedAt: timestamp,
    updatedAt: timestamp,
  }).where(and(eq(serviceApplications.id, applicationId), eq(serviceApplications.userId, userId)));
  return getServiceApplication(userId, applicationId);
}

function defaultServiceRequestValue(service: TransportService) {
  if (service.slug === 'update-mobile-number') return '+91 91234 56789';
  if (service.slug === 'change-address-rc') return '18 Demo Avenue, New Delhi 110002';
  if (service.slug === 'echallan') return 'DL-01-DEMO-7812 · Challan DEMO-1042';
  if (service.slug === 'vehicle-tax') return 'Annual tax period 2026–27';
  if (service.slug.includes('duplicate')) return 'Replace a damaged synthetic document';
  if (service.category === 'licence') return 'LMV — Light motor vehicle';
  if (service.category === 'vehicle') return 'DL-01-DEMO-7812';
  return 'Standard synthetic service request';
}

export async function createRenewal(userId: string, readinessInput?: ReadinessInput) {
  const db = getDb();
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  const [licence] = await db.select().from(driverLicences).where(eq(driverLicences.userId, userId)).limit(1);
  if (!profile || !licence) throw new Error('Synthetic citizen profile is unavailable.');
  const timestamp = now();
  let readinessAssessmentId: string | null = null;
  if (readinessInput) {
    const result = evaluateReadiness(readinessInput);
    readinessAssessmentId = crypto.randomUUID();
    await db.insert(readinessAssessments).values({
      id: readinessAssessmentId,
      userId,
      ...readinessInput,
      readinessStatus: result.status,
      medicalRequired: result.medicalRequired,
      visitExpected: result.visitExpected,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }
  const application: RenewalApplication = {
    id: crypto.randomUUID(), userId, licenceId: licence.id, readinessAssessmentId, currentStep: 0, status: 'Draft', progressPercent: 10,
    contactEmail: profile.email, contactPhone: profile.syntheticPhone, address: licence.address,
    declarationsAccepted: false, feePaise: 45000, submittedAt: null, createdAt: timestamp, updatedAt: timestamp,
  };
  await db.insert(renewalApplications).values(application);
  return application;
}

export async function getApplicationBundle(userId: string, applicationId: string): Promise<ApplicationBundle | null> {
  const db = getDb();
  const [application] = await db.select().from(renewalApplications)
    .where(and(eq(renewalApplications.id, applicationId), eq(renewalApplications.userId, userId))).limit(1);
  if (!application) return null;
  const [licence] = await db.select().from(driverLicences)
    .where(and(eq(driverLicences.id, application.licenceId), eq(driverLicences.userId, userId))).limit(1);
  if (!licence) return null;
  const documents = await db.select().from(applicationDocuments)
    .where(and(eq(applicationDocuments.applicationId, applicationId), eq(applicationDocuments.userId, userId)));
  const [payment] = await db.select().from(payments)
    .where(and(eq(payments.applicationId, applicationId), eq(payments.userId, userId))).limit(1);
  const events = await db.select().from(statusEvents)
    .where(and(eq(statusEvents.applicationId, applicationId), eq(statusEvents.userId, userId))).orderBy(statusEvents.position);
  const [readiness] = application.readinessAssessmentId
    ? await db.select().from(readinessAssessments).where(and(eq(readinessAssessments.id, application.readinessAssessmentId), eq(readinessAssessments.userId, userId))).limit(1)
    : [];
  const recovery = await db.select().from(recoveryEvents)
    .where(and(eq(recoveryEvents.applicationId, applicationId), eq(recoveryEvents.userId, userId))).orderBy(desc(recoveryEvents.createdAt));
  return { application, licence, documents, payment: payment ?? null, events, readiness: readiness ?? null, recoveryEvents: recovery };
}

export async function recordRecoveryEvent(userId: string, applicationId: string, input: RecoveryEventInput) {
  const bundle = await getApplicationBundle(userId, applicationId);
  if (!bundle) return null;
  const event: RecoveryEvent = {
    id: crypto.randomUUID(),
    applicationId,
    userId,
    eventType: input.eventType,
    detail: input.detail,
    resolved: false,
    createdAt: now(),
    resolvedAt: null,
  };
  await getDb().insert(recoveryEvents).values(event);
  return event;
}

export async function updateNextActionState(userId: string, applicationId: string, action: 'simulate' | 'resolve', fileName?: string) {
  const bundle = await getApplicationBundle(userId, applicationId);
  if (!bundle || bundle.application.status === 'Draft') return null;
  const timestamp = now();
  if (action === 'simulate') {
    if (bundle.application.status === 'Action required') return bundle;
    await getDb().update(renewalApplications).set({ status: 'Action required', progressPercent: 45, updatedAt: timestamp })
      .where(and(eq(renewalApplications.id, applicationId), eq(renewalApplications.userId, userId)));
    await getDb().insert(statusEvents).values({
      id: crypto.randomUUID(), applicationId, userId, eventType: 'Action required',
      titleEn: 'Action required', titleHi: 'कार्रवाई आवश्यक',
      descriptionEn: 'The sample address proof needs a clearer filename.',
      descriptionHi: 'नमूना पते के प्रमाण के लिए अधिक स्पष्ट फ़ाइल नाम चाहिए।',
      position: 2, createdAt: timestamp,
    });
  } else {
    await getDb().update(renewalApplications).set({ status: 'Documents checking', progressPercent: 40, updatedAt: timestamp })
      .where(and(eq(renewalApplications.id, applicationId), eq(renewalApplications.userId, userId)));
    await getDb().insert(statusEvents).values({
      id: crypto.randomUUID(), applicationId, userId, eventType: 'Correction received',
      titleEn: 'Sample correction received', titleHi: 'नमूना सुधार प्राप्त हुआ',
      descriptionEn: `Metadata saved for ${fileName ?? 'sample-address-proof.pdf'}. No file was uploaded.`,
      descriptionHi: `${fileName ?? 'sample-address-proof.pdf'} का मेटाडेटा सहेजा गया। कोई फ़ाइल अपलोड नहीं हुई।`,
      position: 3, createdAt: timestamp,
    });
    await getDb().update(recoveryEvents).set({ resolved: true, resolvedAt: timestamp })
      .where(and(eq(recoveryEvents.applicationId, applicationId), eq(recoveryEvents.userId, userId)));
  }
  return getApplicationBundle(userId, applicationId);
}

export async function applyApplicationUpdate(userId: string, applicationId: string, update: ApplicationUpdate) {
  const bundle = await getApplicationBundle(userId, applicationId);
  if (!bundle) throw new Error('Application not found.');
  if (bundle.application.status !== 'Draft' && update.step !== 5) return bundle;
  const db = getDb();
  const timestamp = now();

  if (update.step === 1) {
    await db.update(renewalApplications).set({
      contactEmail: update.data.email, contactPhone: update.data.phone, address: update.data.address,
      currentStep: 2, updatedAt: timestamp,
    }).where(and(eq(renewalApplications.id, applicationId), eq(renewalApplications.userId, userId)));
  } else if (update.step === 2) {
    await db.delete(applicationDocuments)
      .where(and(eq(applicationDocuments.applicationId, applicationId), eq(applicationDocuments.userId, userId)));
    await db.insert(applicationDocuments).values(update.data.documents.map((document) => ({
      id: crypto.randomUUID(), applicationId, userId, ...document,
      verificationStatus: 'Mock selected', createdAt: timestamp,
    })));
    await advanceApplication(userId, applicationId, 3, timestamp);
  } else if (update.step === 4) {
    await db.update(renewalApplications).set({ declarationsAccepted: true, currentStep: 5, updatedAt: timestamp })
      .where(and(eq(renewalApplications.id, applicationId), eq(renewalApplications.userId, userId)));
  } else if (update.step === 5) {
    return completeMockPayment(userId, applicationId, update.data.paymentMethod);
  } else {
    await advanceApplication(userId, applicationId, update.step + 1, timestamp);
  }
  return getApplicationBundle(userId, applicationId);
}

async function advanceApplication(userId: string, applicationId: string, currentStep: number, timestamp: string) {
  const db = getDb();
  await db.update(renewalApplications).set({ currentStep, updatedAt: timestamp })
    .where(and(eq(renewalApplications.id, applicationId), eq(renewalApplications.userId, userId)));
}

async function completeMockPayment(userId: string, applicationId: string, paymentMethod: MockPaymentMethod) {
  const existing = await getApplicationBundle(userId, applicationId);
  if (!existing) throw new Error('Application not found.');
  if (existing.payment) return existing;
  const db = getDb();
  const paidAt = now();
  const transactionReference = `MOCK-TXN-${paidAt.slice(2, 10).replaceAll('-', '')}-${applicationId.slice(0, 6).toUpperCase()}`;
  await db.insert(payments).values({
    id: crypto.randomUUID(), applicationId, userId, amountPaise: 45000,
    state: 'Mock successful', method: paymentMethod, transactionReference, paidAt,
  });
  await db.update(renewalApplications).set({
    currentStep: 6, status: 'Submitted', progressPercent: 25, submittedAt: paidAt, updatedAt: paidAt,
  }).where(and(eq(renewalApplications.id, applicationId), eq(renewalApplications.userId, userId)));
  await db.insert(statusEvents).values({
    id: crypto.randomUUID(), applicationId, userId, eventType: 'Submitted',
    titleEn: 'Submitted', titleHi: 'जमा',
    descriptionEn: 'Synthetic application and mock payment recorded.',
    descriptionHi: 'काल्पनिक आवेदन और मॉक भुगतान दर्ज किया गया।',
    position: 1, createdAt: paidAt,
  });
  await db.insert(notifications).values({
    id: crypto.randomUUID(), applicationId, userId, eventType: 'Submitted', channel: 'In-app', read: false,
    titleEn: 'Application submitted', titleHi: 'आवेदन जमा हुआ',
    bodyEn: 'Your synthetic renewal was submitted. Document checking is the next step.',
    bodyHi: 'आपका काल्पनिक नवीनीकरण जमा हो गया। अगला चरण दस्तावेज़ जाँच है।', createdAt: paidAt,
  });
  return getApplicationBundle(userId, applicationId);
}

export async function getNotifications(userId: string) {
  return getDb().select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(20);
}

export async function markNotificationsRead(userId: string, notificationId?: string) {
  const condition = notificationId
    ? and(eq(notifications.userId, userId), eq(notifications.id, notificationId))
    : eq(notifications.userId, userId);
  await getDb().update(notifications).set({ read: true }).where(condition);
}

export async function getAdminOverview() {
  const db = getDb();
  const [applications, citizens, licences, audit] = await Promise.all([
    db.select().from(renewalApplications).orderBy(desc(renewalApplications.updatedAt)),
    db.select().from(profiles),
    db.select().from(driverLicences),
    db.select().from(adminAuditLogs).orderBy(desc(adminAuditLogs.createdAt)).limit(12),
  ]);
  const profilesByUser = new Map(citizens.map((profile) => [profile.userId, profile]));
  const licencesByUser = new Map(licences.map((licence) => [licence.userId, licence]));
  return {
    applications: applications.map((application) => ({
      application,
      profile: profilesByUser.get(application.userId) ?? null,
      licence: licencesByUser.get(application.userId) ?? null,
    })),
    audit,
  };
}

export async function getAdminApplication(applicationId: string) {
  const db = getDb();
  const [application] = await db.select().from(renewalApplications).where(eq(renewalApplications.id, applicationId)).limit(1);
  if (!application) return null;
  const [[profile], [licence], events, audit] = await Promise.all([
    db.select().from(profiles).where(eq(profiles.userId, application.userId)).limit(1),
    db.select().from(driverLicences).where(eq(driverLicences.userId, application.userId)).limit(1),
    db.select().from(statusEvents).where(eq(statusEvents.applicationId, applicationId)).orderBy(desc(statusEvents.createdAt)),
    db.select().from(adminAuditLogs).where(eq(adminAuditLogs.applicationId, applicationId)).orderBy(desc(adminAuditLogs.createdAt)),
  ]);
  return { application, profile: profile ?? null, licence: licence ?? null, events, audit };
}

const adminStatusTitle = {
  'Submitted': { en: 'Application submitted', hi: 'आवेदन जमा हुआ' },
  'Documents checking': { en: 'Documents are being checked', hi: 'दस्तावेज़ों की जाँच जारी है' },
  'Under review': { en: 'Application is under review', hi: 'आवेदन की समीक्षा जारी है' },
  'Approved': { en: 'Renewal approved', hi: 'नवीनीकरण स्वीकृत' },
  'Action required': { en: 'Action required', hi: 'कार्रवाई आवश्यक' },
} as const;

export async function adminUpdateApplication(adminId: string, applicationId: string, input: AdminStatusUpdateInput) {
  const existing = await getAdminApplication(applicationId);
  if (!existing) return null;
  const db = getDb();
  const timestamp = now();
  const titles = adminStatusTitle[input.status];
  await db.update(renewalApplications).set({ status: input.status, progressPercent: input.progressPercent, updatedAt: timestamp })
    .where(eq(renewalApplications.id, applicationId));
  await db.insert(statusEvents).values({
    id: crypto.randomUUID(), applicationId, userId: existing.application.userId, eventType: input.status,
    titleEn: titles.en, titleHi: titles.hi, descriptionEn: input.message,
    descriptionHi: input.message, position: input.progressPercent, createdAt: timestamp,
  });
  await db.insert(notifications).values({
    id: crypto.randomUUID(), applicationId, userId: existing.application.userId, eventType: input.status,
    titleEn: titles.en, titleHi: titles.hi, bodyEn: input.message, bodyHi: input.message,
    channel: input.queueWhatsapp ? 'In-app + Mock WhatsApp' : 'In-app', read: false, createdAt: timestamp,
  });
  await db.insert(adminAuditLogs).values({
    id: crypto.randomUUID(), adminId, applicationId, previousStatus: existing.application.status,
    nextStatus: input.status, progressPercent: input.progressPercent, citizenMessage: input.message,
    whatsappQueued: input.queueWhatsapp, createdAt: timestamp,
  });
  return getAdminApplication(applicationId);
}

export async function recordAssistantRequest(userId: string, applicationId: string, step: number, questionLength: number) {
  const db = getDb();
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const [result] = await db.select({ value: count() }).from(assistantRequests)
    .where(and(eq(assistantRequests.userId, userId), gte(assistantRequests.createdAt, since)));
  if ((result?.value ?? 0) >= 8) return false;
  await db.insert(assistantRequests).values({
    id: crypto.randomUUID(), userId, applicationId, step, questionLength, createdAt: now(),
  });
  return true;
}

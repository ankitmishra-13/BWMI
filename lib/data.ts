import { and, count, desc, eq, gte } from 'drizzle-orm';
import type { ChatGPTUser } from '@/app/chatgpt-auth';
import { getDb } from '@/db';
import {
  applicationDocuments,
  assistantRequests,
  driverLicences,
  payments,
  profiles,
  renewalApplications,
  serviceApplications,
  statusEvents,
  type ApplicationDocument,
  type DriverLicence,
  type Payment,
  type RenewalApplication,
  type ServiceApplication,
  type StatusEvent,
} from '@/db/schema';
import type { Locale } from '@/lib/i18n';
import type { TransportService } from '@/lib/services';
import type { ApplicationUpdate } from '@/lib/validation';

export type ApplicationBundle = {
  application: RenewalApplication;
  licence: DriverLicence;
  documents: ApplicationDocument[];
  payment: Payment | null;
  events: StatusEvent[];
};

const now = () => new Date().toISOString();

export async function ensureSyntheticCitizen(user: ChatGPTUser, locale: Locale) {
  const db = getDb();
  const timestamp = now();
  const syntheticName = 'Aarav Sharma';
  const syntheticEmail = 'citizen.demo@bwmi.test';
  await db.insert(profiles).values({
    userId: user.userId, email: syntheticEmail, fullName: syntheticName,
    preferredLocale: locale, syntheticPhone: '+91 98765 78120', createdAt: timestamp, updatedAt: timestamp,
  }).onConflictDoUpdate({
    target: profiles.userId,
    set: { email: syntheticEmail, fullName: syntheticName, preferredLocale: locale, updatedAt: timestamp },
  });

  const [existing] = await db.select().from(driverLicences).where(eq(driverLicences.userId, user.userId)).limit(1);
  if (!existing) {
    await db.insert(driverLicences).values({
      id: crypto.randomUUID(), userId: user.userId, maskedNumber: 'DL-••-2014-••7812',
      holderName: syntheticName, dateOfBirth: '1992-08-14', validUntil: '2026-09-18',
      issueState: 'Delhi', vehicleClasses: 'LMV, MCWG', address: '24 Sample Marg, New Delhi 110001',
      eligible: true, createdAt: timestamp,
    });
  }
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
  const application: ServiceApplication = {
    id: crypto.randomUUID(),
    userId,
    serviceSlug: service.slug,
    category: service.category,
    currentStep: 0,
    status: 'Draft',
    selection: null,
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

export async function advanceServiceApplication(userId: string, applicationId: string, step: number, selection?: string): Promise<ServiceApplication | null> {
  const existing = await getServiceApplication(userId, applicationId);
  if (!existing) return null;
  if (existing.status !== 'Draft') return existing;
  const timestamp = now();
  const values: Partial<ServiceApplication> = { currentStep: Math.min(step + 1, 3), updatedAt: timestamp };
  if (selection) values.selection = selection;
  await getDb().update(serviceApplications).set(values)
    .where(and(eq(serviceApplications.id, applicationId), eq(serviceApplications.userId, userId)));
  return getServiceApplication(userId, applicationId);
}

export async function completeServiceApplication(userId: string, applicationId: string): Promise<ServiceApplication | null> {
  const existing = await getServiceApplication(userId, applicationId);
  if (!existing) return null;
  if (existing.status !== 'Draft') return existing;
  const timestamp = now();
  const reference = `RAAHI-${existing.serviceSlug.slice(0, 4).toUpperCase()}-${timestamp.slice(2, 10).replaceAll('-', '')}-${applicationId.slice(0, 5).toUpperCase()}`;
  await getDb().update(serviceApplications).set({
    currentStep: 4,
    status: 'Submitted',
    reference,
    submittedAt: timestamp,
    updatedAt: timestamp,
  }).where(and(eq(serviceApplications.id, applicationId), eq(serviceApplications.userId, userId)));
  return getServiceApplication(userId, applicationId);
}

export async function createRenewal(userId: string) {
  const db = getDb();
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  const [licence] = await db.select().from(driverLicences).where(eq(driverLicences.userId, userId)).limit(1);
  if (!profile || !licence) throw new Error('Synthetic citizen profile is unavailable.');
  const timestamp = now();
  const application: RenewalApplication = {
    id: crypto.randomUUID(), userId, licenceId: licence.id, currentStep: 0, status: 'Draft',
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
  return { application, licence, documents, payment: payment ?? null, events };
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
    return completeMockPayment(userId, applicationId);
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

async function completeMockPayment(userId: string, applicationId: string) {
  const existing = await getApplicationBundle(userId, applicationId);
  if (!existing) throw new Error('Application not found.');
  if (existing.payment) return existing;
  const db = getDb();
  const paidAt = now();
  const transactionReference = `MOCK-TXN-${paidAt.slice(2, 10).replaceAll('-', '')}-${applicationId.slice(0, 6).toUpperCase()}`;
  await db.insert(payments).values({
    id: crypto.randomUUID(), applicationId, userId, amountPaise: 45000,
    state: 'Mock successful', transactionReference, paidAt,
  });
  await db.update(renewalApplications).set({
    currentStep: 6, status: 'Submitted', submittedAt: paidAt, updatedAt: paidAt,
  }).where(and(eq(renewalApplications.id, applicationId), eq(renewalApplications.userId, userId)));
  await db.insert(statusEvents).values({
    id: crypto.randomUUID(), applicationId, userId, eventType: 'Submitted',
    titleEn: 'Submitted', titleHi: 'जमा',
    descriptionEn: 'Synthetic application and mock payment recorded.',
    descriptionHi: 'काल्पनिक आवेदन और मॉक भुगतान दर्ज किया गया।',
    position: 1, createdAt: paidAt,
  });
  return getApplicationBundle(userId, applicationId);
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

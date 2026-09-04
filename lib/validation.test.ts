import { describe, expect, it } from 'vitest';
import { adminAssistantSchema, adminStatusUpdateSchema, applicationUpdateSchema, contactSchema, documentSchema, serviceApplicationUpdateSchema, syntheticProfileSchema, syntheticRegistrationSchema } from '@/lib/validation';

describe('renewal validation', () => {
  it('accepts synthetic contact details', () => {
    expect(contactSchema.safeParse({ email: 'citizen.demo@bwmi.test', phone: '+91 98765 78120', address: '24 Sample Marg, New Delhi 110001' }).success).toBe(true);
  });

  it('rejects the wrong mock OTP', () => {
    expect(applicationUpdateSchema.safeParse({ step: 3, data: { otp: '654321' } }).success).toBe(false);
  });

  it('caps document metadata at five megabytes', () => {
    expect(documentSchema.safeParse({ documentType: 'Address proof', fileName: 'sample.pdf', sizeBytes: 5_000_001 }).success).toBe(false);
  });

  it('keeps profile email inside the synthetic demo domain', () => {
    expect(syntheticProfileSchema.safeParse({ fullName: 'Aarav Sharma', email: 'citizen.demo@bwmi.test', syntheticPhone: '+91 98765 78120', preferredLocale: 'en' }).success).toBe(true);
    expect(syntheticProfileSchema.safeParse({ fullName: 'Aarav Sharma', email: 'person@example.com', syntheticPhone: '+91 98765 78120', preferredLocale: 'en' }).success).toBe(false);
  });

  it('requires complete fictional details before a service request can advance', () => {
    const details = {
      contactEmail: 'citizen.demo@bwmi.test',
      contactPhone: '+91 98765 78120',
      address: '24 Sample Marg, New Delhi 110001',
      requestValue: '+91 91234 56789',
      requestReason: 'Citizen record update',
      selection: 'standard',
    } as const;
    expect(serviceApplicationUpdateSchema.safeParse({ step: 1, data: details }).success).toBe(true);
    expect(serviceApplicationUpdateSchema.safeParse({ step: 1, data: { selection: 'standard' } }).success).toBe(false);
  });

  it('accepts only an explicitly mock payment method', () => {
    expect(applicationUpdateSchema.safeParse({ step: 5, data: { paymentMethod: 'mock-card' } }).success).toBe(true);
    expect(applicationUpdateSchema.safeParse({ step: 5, data: { paymentMethod: 'upi' } }).success).toBe(false);
  });

  it('requires the visible OTP and explicit mock DigiLocker consent for registration', () => {
    const registration = { fullName: 'Meena Sharma', email: 'meena.demo@bwmi.test', syntheticPhone: '+91 91234 56789', locale: 'en', otp: '123456', digilockerConsent: 'yes' } as const;
    expect(syntheticRegistrationSchema.safeParse(registration).success).toBe(true);
    expect(syntheticRegistrationSchema.safeParse({ ...registration, otp: '654321' }).success).toBe(false);
    expect(syntheticRegistrationSchema.safeParse({ ...registration, email: 'meena@example.com' }).success).toBe(false);
  });

  it('keeps admin status updates inside the visible progress contract', () => {
    expect(adminStatusUpdateSchema.safeParse({ status: 'Under review', progressPercent: 70, message: 'Your synthetic application is now under review.', queueWhatsapp: true }).success).toBe(true);
    expect(adminStatusUpdateSchema.safeParse({ status: 'Under review', progressPercent: 140, message: 'Too far.', queueWhatsapp: true }).success).toBe(false);
  });

  it('caps the admin copilot prompt and accepts scoped context', () => {
    expect(adminAssistantSchema.safeParse({ question: 'Which queue needs attention?', stateCode: 'dl', contextType: '/admin' }).success).toBe(true);
    expect(adminAssistantSchema.safeParse({ question: 'x'.repeat(301), contextType: '/admin' }).success).toBe(false);
  });
});

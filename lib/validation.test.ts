import { describe, expect, it } from 'vitest';
import { applicationUpdateSchema, contactSchema, documentSchema, syntheticProfileSchema } from '@/lib/validation';

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
});

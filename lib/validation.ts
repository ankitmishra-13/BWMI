import { z } from 'zod';

export const contactSchema = z.object({
  email: z.string().trim().email().max(120),
  phone: z.string().trim().min(10).max(24),
  address: z.string().trim().min(12).max(240),
});

export const documentSchema = z.object({
  documentType: z.enum(['Address proof', 'Medical certificate']),
  fileName: z.string().trim().min(1).max(120),
  sizeBytes: z.number().int().positive().max(5_000_000),
});

export const mockPaymentMethodSchema = z.enum(['mock-upi', 'mock-card', 'mock-netbanking']);

export const readinessInputSchema = z.object({
  ageBand: z.enum(['under-40', '40-59', '60-plus']),
  licenceType: z.enum(['private', 'transport']),
  expirySituation: z.enum(['more-than-year', 'within-year', 'expired-under-year', 'expired-over-year']),
  issueState: z.enum(['Delhi', 'Maharashtra', 'Karnataka']),
  addressChanged: z.boolean(),
  servicePreference: z.enum(['standard', 'assisted']),
  preferredLocale: z.enum(['en', 'hi']),
});

export const readinessCopilotSchema = z.object({
  locale: z.enum(['en', 'hi']),
  message: z.string().trim().min(3).max(300),
});

export const readinessCopilotOutputSchema = z.object({
  fields: readinessInputSchema.partial(),
  summary: z.string().trim().min(1).max(360),
  followUp: z.string().trim().min(1).max(180),
});

export const citizenPreferenceSchema = z.object({
  largeText: z.boolean(),
  highContrast: z.boolean(),
  reducedMotion: z.boolean(),
  lowBandwidth: z.boolean(),
  simplifiedGuidance: z.boolean(),
  readAloud: z.boolean(),
});

export const recoveryEventSchema = z.object({
  eventType: z.enum(['network', 'otp', 'payment']),
  detail: z.string().trim().min(2).max(120),
});

export const nextActionUpdateSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('simulate') }),
  z.object({ action: z.literal('resolve'), fileName: z.string().trim().min(1).max(120) }),
]);

export const applicationUpdateSchema = z.discriminatedUnion('step', [
  z.object({ step: z.literal(0), data: z.object({ confirmed: z.literal(true) }) }),
  z.object({ step: z.literal(1), data: contactSchema }),
  z.object({ step: z.literal(2), data: z.object({ documents: z.array(documentSchema).min(1).max(2) }) }),
  z.object({ step: z.literal(3), data: z.object({ otp: z.literal('123456') }) }),
  z.object({ step: z.literal(4), data: z.object({ declarationsAccepted: z.literal(true) }) }),
  z.object({ step: z.literal(5), data: z.object({ paymentMethod: mockPaymentMethodSchema }) }),
]);

export const assistantSchema = z.object({
  applicationId: z.string().uuid(), step: z.number().int().min(0).max(5), locale: z.enum(['en', 'hi']), question: z.string().trim().min(3).max(300),
});

export const serviceApplicationCreateSchema = z.object({
  serviceSlug: z.string().trim().min(2).max(80),
  locale: z.enum(['en', 'hi']),
});

export const serviceApplicationDetailsSchema = z.object({
  contactEmail: z.string().trim().email().max(120).refine((value) => value.toLowerCase().endsWith('@bwmi.test'), 'Use the fictional @bwmi.test address.'),
  contactPhone: z.string().trim().regex(/^\+91 [6-9]\d{4} \d{5}$/, 'Use the displayed synthetic mobile format.'),
  address: z.string().trim().min(12).max(240),
  requestValue: z.string().trim().min(2).max(180),
  requestReason: z.string().trim().min(2).max(100),
  selection: z.enum(['standard', 'assisted']),
});

export const serviceApplicationUpdateSchema = z.discriminatedUnion('step', [
  z.object({ step: z.literal(0), data: z.object({ confirmed: z.literal(true) }) }),
  z.object({ step: z.literal(1), data: serviceApplicationDetailsSchema }),
  z.object({ step: z.literal(2), data: z.object({ otp: z.literal('123456') }) }),
  z.object({ step: z.literal(3), data: z.object({ declarationsAccepted: z.literal(true) }) }),
  z.object({ step: z.literal(4), data: z.object({ paymentMethod: mockPaymentMethodSchema }) }),
]);

export const syntheticProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(60),
  email: z.string().trim().email().max(120).refine((value) => value.toLowerCase().endsWith('@bwmi.test'), 'Use the fictional @bwmi.test address.'),
  syntheticPhone: z.string().trim().regex(/^\+91 [6-9]\d{4} \d{5}$/, 'Use the displayed synthetic mobile format.'),
  preferredLocale: z.enum(['en', 'hi']),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ReadinessInput = z.infer<typeof readinessInputSchema>;
export type ReadinessCopilotOutput = z.infer<typeof readinessCopilotOutputSchema>;
export type CitizenPreferenceInput = z.infer<typeof citizenPreferenceSchema>;
export type RecoveryEventInput = z.infer<typeof recoveryEventSchema>;
export type ApplicationUpdate = z.infer<typeof applicationUpdateSchema>;
export type ServiceApplicationDetailsInput = z.infer<typeof serviceApplicationDetailsSchema>;
export type ServiceApplicationUpdate = z.infer<typeof serviceApplicationUpdateSchema>;
export type MockPaymentMethod = z.infer<typeof mockPaymentMethodSchema>;
export type SyntheticProfileInput = z.infer<typeof syntheticProfileSchema>;

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

export const applicationUpdateSchema = z.discriminatedUnion('step', [
  z.object({ step: z.literal(0), data: z.object({ confirmed: z.literal(true) }) }),
  z.object({ step: z.literal(1), data: contactSchema }),
  z.object({ step: z.literal(2), data: z.object({ documents: z.array(documentSchema).min(1).max(2) }) }),
  z.object({ step: z.literal(3), data: z.object({ otp: z.literal('123456') }) }),
  z.object({ step: z.literal(4), data: z.object({ declarationsAccepted: z.literal(true) }) }),
  z.object({ step: z.literal(5), data: z.object({ simulateFailure: z.boolean().optional() }) }),
]);

export const assistantSchema = z.object({
  applicationId: z.string().uuid(), step: z.number().int().min(0).max(5), locale: z.enum(['en', 'hi']), question: z.string().trim().min(3).max(300),
});

export const serviceApplicationCreateSchema = z.object({
  serviceSlug: z.string().trim().min(2).max(80),
  locale: z.enum(['en', 'hi']),
});

export const serviceApplicationUpdateSchema = z.discriminatedUnion('step', [
  z.object({ step: z.literal(0), data: z.object({ confirmed: z.literal(true) }) }),
  z.object({ step: z.literal(1), data: z.object({ selection: z.enum(['standard', 'priority', 'assisted']) }) }),
  z.object({ step: z.literal(2), data: z.object({ otp: z.literal('123456') }) }),
  z.object({ step: z.literal(3), data: z.object({ declarationsAccepted: z.literal(true) }) }),
]);

export type ContactInput = z.infer<typeof contactSchema>;
export type ApplicationUpdate = z.infer<typeof applicationUpdateSchema>;

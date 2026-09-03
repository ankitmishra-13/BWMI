import { describe, expect, it } from 'vitest';
import { evaluateReadiness, interpretCitizenMessage } from '@/lib/readiness';

describe('renewal readiness rules', () => {
  it('flags a medical form for citizens aged 40 and above', () => {
    const result = evaluateReadiness({ ageBand: '40-59', licenceType: 'private', expirySituation: 'within-year', issueState: 'Delhi', addressChanged: false, servicePreference: 'standard', preferredLocale: 'en' });
    expect(result.medicalRequired).toBe(true);
    expect(result.documents.map((item) => item.id)).toContain('form-1a');
    expect(result.status).toBe('ready');
  });

  it('explains additional review for an old transport licence', () => {
    const result = evaluateReadiness({ ageBand: 'under-40', licenceType: 'transport', expirySituation: 'expired-over-year', issueState: 'Karnataka', addressChanged: true, servicePreference: 'assisted', preferredLocale: 'hi' });
    expect(result.status).toBe('attention');
    expect(result.medicalRequired).toBe(true);
    expect(result.visitExpected).toBe(true);
    expect(result.blockers).toHaveLength(2);
    expect(result.documents.map((item) => item.id)).toContain('address');
  });
});

describe('built-in bilingual interpretation', () => {
  it('extracts a plain-English renewal situation', () => {
    const result = interpretCitizenMessage('I am 55, my private licence expires next month, and I live in Delhi.', 'en');
    expect(result.fields).toMatchObject({ ageBand: '40-59', licenceType: 'private', expirySituation: 'within-year', issueState: 'Delhi' });
  });

  it('extracts a Hindi assisted transport scenario', () => {
    const result = interpretCitizenMessage('मेरी उम्र 62 है, परिवहन लाइसेंस खत्म हो गया और सहायता केंद्र चाहिए', 'hi');
    expect(result.fields).toMatchObject({ ageBand: '60-plus', licenceType: 'transport', expirySituation: 'expired-under-year', servicePreference: 'assisted', preferredLocale: 'hi' });
  });

  it('does not mistake less than one year for an old expiry', () => {
    const result = interpretCitizenMessage('My private licence expired less than one year ago in Delhi.', 'en');
    expect(result.fields.expirySituation).toBe('expired-under-year');
  });
});

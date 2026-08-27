import { describe, expect, it } from 'vitest';
import { getCopy, isLocale, localPath } from '@/lib/i18n';

describe('bilingual routing and dictionaries', () => {
  it('recognises only supported locale segments', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('hi')).toBe(true);
    expect(isLocale('fr')).toBe(false);
  });

  it('keeps the same route when the locale changes', () => {
    expect(localPath('hi', '/dashboard')).toBe('/hi/dashboard');
  });

  it('ships Hindi core journey copy', () => {
    const copy = getCopy('hi');
    expect(copy.heroTitle).toContain('लाइसेंस');
    expect(copy.submitPayment).toContain('भुगतान');
  });
});

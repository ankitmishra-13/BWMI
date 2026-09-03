'use client';

import { useEffect } from 'react';
import type { CitizenPreferenceInput } from '@/lib/validation';

const storageKey = 'raahi-experience-preferences';

export function applyExperiencePreferences(preferences: CitizenPreferenceInput) {
  const root = document.getElementById('top');
  if (!root) return;
  Object.entries(preferences).forEach(([key, value]) => {
    root.setAttribute(`data-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`, String(value));
  });
  localStorage.setItem(storageKey, JSON.stringify(preferences));
}

export function ExperiencePreferencesBootstrap() {
  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      applyExperiencePreferences(JSON.parse(raw) as CitizenPreferenceInput);
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, []);
  return null;
}

'use client';

import { useEffect, useState } from 'react';
import { Accessibility, CheckCircle2, Gauge, Languages, ScanText, Sparkles, Volume2 } from 'lucide-react';
import { applyExperiencePreferences } from '@/components/experience-preferences-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Field, FieldContent, FieldDescription, FieldGroup, FieldTitle } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import type { Locale } from '@/lib/i18n';
import type { CitizenPreferenceInput } from '@/lib/validation';

const copy = {
  en: {
    title: 'Make Raahi comfortable for you', body: 'Changes appear immediately and stay with your synthetic account.', saved: 'Changes save automatically.', saving: 'Saving your preference…',
    largeText: ['Larger text', 'Increase text throughout the site.'], highContrast: ['Stronger contrast', 'Use darker text and clearer boundaries.'], reducedMotion: ['Reduce motion', 'Remove non-essential animation.'], lowBandwidth: ['Low-data mode', 'Remove texture, blur, and heavy visual effects.'], simplifiedGuidance: ['Simpler guidance', 'Hide optional detail and keep the essential next step.'], readAloud: ['Read-aloud preference', 'Show that spoken guidance is preferred where available.'],
  },
  hi: {
    title: 'Raahi को अपने लिए सुविधाजनक बनाएँ', body: 'बदलाव तुरंत दिखाई देते हैं और आपके काल्पनिक खाते में बने रहते हैं।', saved: 'बदलाव अपने आप सहेजे जाते हैं।', saving: 'आपकी पसंद सहेजी जा रही है…',
    largeText: ['बड़ा टेक्स्ट', 'पूरी साइट पर टेक्स्ट का आकार बढ़ाएँ।'], highContrast: ['अधिक कंट्रास्ट', 'गहरा टेक्स्ट और स्पष्ट सीमाएँ उपयोग करें।'], reducedMotion: ['कम गति', 'गैर-ज़रूरी एनिमेशन हटाएँ।'], lowBandwidth: ['कम डेटा मोड', 'टेक्सचर, ब्लर और भारी विज़ुअल प्रभाव हटाएँ।'], simplifiedGuidance: ['सरल मार्गदर्शन', 'वैकल्पिक जानकारी छिपाकर ज़रूरी अगला कदम रखें।'], readAloud: ['सुनकर समझने की पसंद', 'जहाँ उपलब्ध हो, बोले गए मार्गदर्शन को प्राथमिकता दें।'],
  },
} as const;

const options: Array<{ key: keyof CitizenPreferenceInput; icon: typeof Accessibility }> = [
  { key: 'largeText', icon: ScanText }, { key: 'highContrast', icon: Accessibility }, { key: 'reducedMotion', icon: Sparkles },
  { key: 'lowBandwidth', icon: Gauge }, { key: 'simplifiedGuidance', icon: Languages }, { key: 'readAloud', icon: Volume2 },
];

export function PreferencesPanel({ locale, initialPreferences }: { locale: Locale; initialPreferences: CitizenPreferenceInput }) {
  const text = copy[locale];
  const [preferences, setPreferences] = useState(initialPreferences);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    applyExperiencePreferences(initialPreferences);
  }, [initialPreferences]);
  async function updatePreference(key: keyof CitizenPreferenceInput, value: boolean) {
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    applyExperiencePreferences(next);
    setSaving(true);
    try {
      const response = await fetch('/api/preferences', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next) });
      if (!response.ok) throw new Error('Preference could not be saved.');
    } finally { setSaving(false); }
  }
  return (
    <section className="ios-panel min-w-0 p-5 sm:p-8" aria-labelledby="preferences-heading">
      <div className="flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary"><Accessibility className="size-5" /></span><div><h2 id="preferences-heading" className="text-2xl">{text.title}</h2><p className="mt-1 text-sm text-muted-foreground">{text.body}</p></div></div>
      <Alert className="mt-6 bg-[#EAF7EF] text-success"><CheckCircle2 /><AlertTitle>{saving ? text.saving : text.saved}</AlertTitle><AlertDescription>{locale === 'hi' ? 'आप इन्हें कभी भी बदल सकते हैं।' : 'You can change them at any time.'}</AlertDescription></Alert>
      <FieldGroup className="mt-7 gap-0 divide-y">
        {options.map(({ key, icon: Icon }) => {
          const [title, description] = text[key];
          return <Field key={key} orientation="horizontal" className="items-start py-5 first:pt-0 last:pb-0"><Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" /><FieldContent><FieldTitle>{title}</FieldTitle><FieldDescription>{description}</FieldDescription></FieldContent><Switch checked={preferences[key]} onCheckedChange={(checked) => void updatePreference(key, checked)} aria-label={title} /></Field>;
        })}
      </FieldGroup>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { Square, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/lib/i18n';

export function ReadAloudButton({ locale, text }: { locale: Locale; text: string }) {
  const [speaking, setSpeaking] = useState(false);

  function toggle() {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.92;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  return <Button type="button" variant="secondary" size="sm" onClick={toggle}>{speaking ? <Square /> : <Volume2 />}{speaking ? (locale === 'hi' ? 'रोकें' : 'Stop') : (locale === 'hi' ? 'सुनें' : 'Listen')}</Button>;
}

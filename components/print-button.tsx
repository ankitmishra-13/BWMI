'use client';

import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PrintButton({ label }: { label: string }) {
  return <Button type="button" variant="outline" onClick={() => window.print()} className="no-print"><Printer data-icon="inline-start" />{label}</Button>;
}

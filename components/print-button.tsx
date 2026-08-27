'use client';

import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PrintButton({ label }: { label: string }) {
  return <Button type="button" variant="outline" onClick={() => window.print()} className="no-print h-11 border-[#9FB0C0] bg-white px-4"><Printer />{label}</Button>;
}

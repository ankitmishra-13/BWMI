'use client';

import { Building2, CheckCircle2, CreditCard, IndianRupee, QrCode, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FieldDescription, FieldLegend, FieldSet } from '@/components/ui/field';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { Locale } from '@/lib/i18n';
import type { MockPaymentMethod } from '@/lib/validation';

export type MockGatewayState = 'idle' | 'processing' | 'success' | 'failure';

export function MockPaymentGateway({
  amountPaise,
  applicationId,
  locale,
  value,
  state = 'idle',
  onValueChange,
  onPreviewFailure,
}: {
  amountPaise: number;
  applicationId: string;
  locale: Locale;
  value: MockPaymentMethod;
  state?: MockGatewayState;
  onValueChange: (value: MockPaymentMethod) => void;
  onPreviewFailure?: () => void;
}) {
  const hi = locale === 'hi';
  const amount = new Intl.NumberFormat(hi ? 'hi-IN' : 'en-IN', { style: 'currency', currency: 'INR' }).format(amountPaise / 100);
  return (
    <div className="overflow-hidden rounded-[1.6rem] border bg-background">
      <div className="route-texture flex flex-col gap-6 p-5 text-white sm:flex-row sm:items-end sm:justify-between sm:p-7">
        <div>
          <div className="flex items-center gap-2"><Badge variant="secondary">{hi ? 'मॉक चेकआउट' : 'MOCK CHECKOUT'}</Badge><span className="text-xs text-white/60">#{applicationId.slice(0, 8).toUpperCase()}</span></div>
          <p className="mt-5 text-sm text-white/62">{hi ? 'देय नमूना राशि' : 'Sample amount due'}</p>
          <p className="mt-1 font-heading text-4xl leading-none">{amount}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/70"><ShieldCheck aria-hidden="true" className="size-4" />{hi ? 'कोई वास्तविक भुगतान नहीं' : 'No real payment'}</div>
      </div>

      <div className="flex flex-col gap-6 p-5 sm:p-7">
        {state === 'success' ? (
          <Alert className="bg-secondary text-success"><CheckCircle2 /><AlertTitle>{hi ? 'मॉक भुगतान सफल' : 'Mock payment successful'}</AlertTitle><AlertDescription>{hi ? 'रसीद और काल्पनिक संदर्भ बनाया जा रहा है।' : 'Creating your receipt and synthetic reference.'}</AlertDescription></Alert>
        ) : (
          <Alert className="bg-secondary"><IndianRupee /><AlertTitle>{hi ? 'सुरक्षित डेमो गेटवे' : 'Safe demo gateway'}</AlertTitle><AlertDescription>{hi ? 'केवल एक तरीका चुनें। कार्ड नंबर, बैंक लॉगिन या UPI ID कभी नहीं माँगी जाएगी।' : 'Choose only a method. No card number, bank login, or UPI ID will ever be requested.'}</AlertDescription></Alert>
        )}

        <FieldSet disabled={state === 'processing' || state === 'success'}>
          <FieldLegend>{hi ? 'मॉक भुगतान तरीका' : 'Mock payment method'}</FieldLegend>
          <ToggleGroup type="single" variant="outline" value={value} onValueChange={(next) => next && onValueChange(next as MockPaymentMethod)} className="grid w-full grid-cols-1 sm:grid-cols-3" aria-label={hi ? 'मॉक भुगतान तरीका चुनें' : 'Choose a mock payment method'}>
            <ToggleGroupItem value="mock-upi" className="h-auto min-h-20 flex-col items-start rounded-2xl p-4">
              <QrCode data-icon="inline-start" /><span className="mt-2 font-semibold">{hi ? 'मॉक UPI' : 'Mock UPI'}</span><span className="text-xs font-normal text-muted-foreground">{hi ? 'कोई UPI ID नहीं' : 'No UPI ID'}</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="mock-card" className="h-auto min-h-20 flex-col items-start rounded-2xl p-4">
              <CreditCard data-icon="inline-start" /><span className="mt-2 font-semibold">{hi ? 'मॉक कार्ड' : 'Mock card'}</span><span className="text-xs font-normal text-muted-foreground">{hi ? 'कोई कार्ड नंबर नहीं' : 'No card number'}</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="mock-netbanking" className="h-auto min-h-20 flex-col items-start rounded-2xl p-4">
              <Building2 data-icon="inline-start" /><span className="mt-2 font-semibold">{hi ? 'मॉक नेट बैंकिंग' : 'Mock net banking'}</span><span className="text-xs font-normal text-muted-foreground">{hi ? 'कोई बैंक लॉगिन नहीं' : 'No bank login'}</span>
            </ToggleGroupItem>
          </ToggleGroup>
          <FieldDescription>{hi ? 'चयन केवल मॉक रसीद पर दिखेगा। कोई वित्तीय डेटा सहेजा नहीं जाता।' : 'Your choice appears only on the mock receipt. No financial data is stored.'}</FieldDescription>
        </FieldSet>

        {onPreviewFailure && state !== 'success' && <Button type="button" variant="ghost" className="self-start" onClick={onPreviewFailure}>{hi ? 'विफल भुगतान का सुधार देखें' : 'Preview failed-payment recovery'}</Button>}
      </div>
    </div>
  );
}

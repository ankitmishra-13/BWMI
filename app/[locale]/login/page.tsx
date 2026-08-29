import Link from 'next/link';
import { ArrowLeft, ArrowRight, KeyRound, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';
import { DEMO_EMAIL, DEMO_PASSWORD, getChatGPTUser, safeRelativeReturnPath } from '@/app/chatgpt-auth';
import { SiteHeader } from '@/components/site-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { getCopy, isLocale, localPath } from '@/lib/i18n';
import { portalCopy } from '@/lib/services';

export const dynamic = 'force-dynamic';

export default async function LoginPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ returnTo?: string; error?: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const copy = getCopy(locale);
  const portal = portalCopy[locale];
  const query = await searchParams;
  const returnTo = safeRelativeReturnPath(query.returnTo || localPath(locale, '/dashboard'));
  const user = await getChatGPTUser();
  const hi = locale === 'hi';

  return (
    <div lang={locale} className="civic-paper">
      <SiteHeader locale={locale} user={user} />
      <main id="main" className="py-10 sm:py-16">
        <div className="shell grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,.85fr)_minmax(420px,.65fr)] lg:items-start">
          <section className="max-w-xl pt-3">
            <p className="eyebrow">{hi ? 'सुरक्षित जज प्रवेश' : 'Safe judge access'}</p>
            <h1 className="mt-4 text-5xl leading-[.98] tracking-[-.04em] sm:text-7xl">{hi ? 'काल्पनिक नागरिक कार्यक्षेत्र खोलें।' : 'Enter the synthetic citizen workspace.'}</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{hi ? 'यह साझा डेमो खाता केवल काल्पनिक लाइसेंस, वाहन, दस्तावेज़ और आवेदन खोलता है। किसी वास्तविक सरकारी खाते की जरूरत नहीं है।' : 'This shared demo account opens only fictional licences, vehicles, documents, and applications. No real government account is needed.'}</p>
            <ol className="mt-9 border-y">
              {[
                hi ? 'डेमो क्रेडेंशियल से साइन इन करें' : 'Sign in with the public demo credentials',
                hi ? 'कोई भी सेवा चुनें' : 'Choose any service',
                hi ? 'मॉक रसीद और स्थिति तक जाएँ' : 'Reach a mock receipt and status',
              ].map((item, index) => <li key={item} className="grid grid-cols-[44px_1fr] gap-4 border-b py-5 last:border-0"><span className="text-sm font-semibold text-muted-foreground">0{index + 1}</span><p className="font-medium">{item}</p></li>)}
            </ol>
          </section>

          <section aria-labelledby="login-title" className="ios-panel p-6 sm:p-8">
            <div className="flex items-start gap-4 border-b pb-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary"><KeyRound aria-hidden="true" /></span>
              <div><h2 id="login-title" className="text-2xl">{hi ? 'डेमो साइन इन' : 'Demo sign in'}</h2><p className="mt-1 text-sm text-muted-foreground">{portal.prototype}</p></div>
            </div>

            {query.error && <Alert variant="destructive" className="mt-6"><AlertTitle>{hi ? 'क्रेडेंशियल मेल नहीं खाते' : 'Credentials did not match'}</AlertTitle><AlertDescription>{hi ? 'नीचे दिखाए गए सार्वजनिक डेमो क्रेडेंशियल का उपयोग करें।' : 'Use the public demo credentials shown below.'}</AlertDescription></Alert>}

            <form action="/api/demo-auth/login" method="post" className="mt-6">
              <input type="hidden" name="returnTo" value={returnTo} />
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">{copy.email}</FieldLabel>
                  <Input id="email" name="email" type="email" defaultValue={DEMO_EMAIL} autoComplete="username" className="h-12 bg-white" required />
                  <FieldDescription>{hi ? 'सार्वजनिक और केवल इस काल्पनिक डेमो के लिए।' : 'Public and used only for this synthetic demo.'}</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">{hi ? 'पासवर्ड' : 'Password'}</FieldLabel>
                  <Input id="password" name="password" type="text" defaultValue={DEMO_PASSWORD} autoComplete="current-password" className="h-12 bg-white font-mono" required />
                  <FieldDescription>{hi ? 'यह वास्तविक पासवर्ड नहीं है और इसे दोबारा उपयोग न करें।' : 'This is not a real password and should not be reused.'}</FieldDescription>
                </Field>
              </FieldGroup>
              <Button type="submit" size="lg" className="mt-7 w-full">{hi ? 'डेमो कार्यक्षेत्र खोलें' : 'Open demo workspace'}<ArrowRight data-icon="inline-end" /></Button>
            </form>

            <Alert className="mt-6 bg-secondary/70"><ShieldCheck /><AlertTitle>{hi ? 'केवल काल्पनिक डेटा' : 'Synthetic data only'}</AlertTitle><AlertDescription>{hi ? 'वास्तविक ID, संपर्क, OTP या भुगतान विवरण न डालें।' : 'Never enter a real ID, contact, OTP, or payment detail.'}</AlertDescription></Alert>

            <Button asChild variant="outline" className="mt-5 px-5"><Link href={localPath(locale)}><ArrowLeft data-icon="inline-start" />{portal.home}</Link></Button>
          </section>
        </div>
      </main>
    </div>
  );
}

import Link from 'next/link';
import { ArrowLeft, LockKeyhole, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getChatGPTUser, safeRelativeReturnPath } from '@/app/chatgpt-auth';
import { RegisterFunnel } from '@/components/register-funnel';
import { SiteHeader } from '@/components/site-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { isLocale, localPath } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default async function RegisterPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ returnTo?: string; error?: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const hi = locale === 'hi';
  const query = await searchParams;
  const returnTo = safeRelativeReturnPath(query.returnTo || localPath(locale, '/dashboard'));
  const user = await getChatGPTUser();
  return <div lang={locale} className="civic-paper"><SiteHeader locale={locale} user={user} /><main id="main" className="py-10 sm:py-16"><div className="shell grid max-w-6xl gap-10 lg:grid-cols-[.7fr_1fr] lg:items-start"><section className="pt-3"><p className="eyebrow">{hi ? 'नया नागरिक कार्यक्षेत्र' : 'New citizen workspace'}</p><h1 className="mt-4 text-5xl leading-[.98] tracking-[-.04em] sm:text-7xl">{hi ? 'एक बार जोड़ें। हर यात्रा तैयार रखें।' : 'Link once. Start every journey prepared.'}</h1><p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">{hi ? 'काल्पनिक विवरण सत्यापित करें और चुनिंदा मॉक DigiLocker रिकॉर्ड जोड़ें। कोई सरकारी प्रणाली या वास्तविक पहचान डेटा उपयोग नहीं होता।' : 'Verify fictional details and attach selected mock DigiLocker records. No government system or real identity data is used.'}</p><Alert className="mt-8 bg-secondary/65"><ShieldCheck /><AlertTitle>{hi ? 'हैकाथॉन सिमुलेशन' : 'Hackathon simulation'}</AlertTitle><AlertDescription>{hi ? 'OTP, DigiLocker सहमति, रिकॉर्ड और WhatsApp अपडेट सभी मॉक हैं।' : 'OTP, DigiLocker consent, records, and WhatsApp updates are all mocked.'}</AlertDescription></Alert></section><section aria-labelledby="register-title" className="ios-panel p-6 sm:p-8"><div className="flex items-start gap-4 border-b pb-6"><span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary"><LockKeyhole /></span><div><h2 id="register-title" className="text-2xl">{hi ? 'काल्पनिक पंजीकरण' : 'Synthetic registration'}</h2><p className="mt-1 text-sm text-muted-foreground">{hi ? 'चार चरण · लगभग 2 मिनट' : 'Four steps · about 2 minutes'}</p></div></div>{query.error && <Alert variant="destructive" className="mt-5"><AlertTitle>{hi ? 'विवरण पूरे नहीं थे' : 'Some details were incomplete'}</AlertTitle><AlertDescription>{hi ? 'काल्पनिक प्रारूप का उपयोग करके फिर प्रयास करें।' : 'Try again using the fictional formats shown.'}</AlertDescription></Alert>}<div className="mt-6"><RegisterFunnel locale={locale} returnTo={returnTo} /></div><Button asChild variant="ghost" className="mt-5"><Link href={localPath(locale)}><ArrowLeft data-icon="inline-start" />{hi ? 'होम' : 'Home'}</Link></Button></section></div></main></div>;
}

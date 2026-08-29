import Link from 'next/link';
import { ArrowLeft, ArrowRight, BarChart3, CheckCircle2, Clock3, FileCheck2, IndianRupee, KeyRound, ShieldCheck, Sparkles } from 'lucide-react';
import { notFound } from 'next/navigation';
import { demoSignInPath, getChatGPTUser } from '@/app/chatgpt-auth';
import { ServiceStartButton } from '@/components/service-start-button';
import { SiteHeader } from '@/components/site-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { isLocale, localPath } from '@/lib/i18n';
import { categoryCopy, getService, portalCopy, servicePath, servicesByCategory, t } from '@/lib/services';

export const dynamic = 'force-dynamic';

export default async function ServiceDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const service = getService(slug);
  if (!service) notFound();
  const portal = portalCopy[locale];
  const user = await getChatGPTUser();
  const related = servicesByCategory(service.category).filter((item) => item.slug !== service.slug).slice(0, 3);
  const fee = service.feePaise === null ? portal.free : new Intl.NumberFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(service.feePaise / 100) + ` (${locale === 'hi' ? 'मॉक' : 'mock'})`;
  const hi = locale === 'hi';

  return (
    <div lang={locale}>
      <SiteHeader locale={locale} user={user} />
      <main id="main">
        <section className="border-b bg-white py-12 sm:py-18">
          <div className="shell">
            <Link href={localPath(locale, `/services?category=${service.category}`)} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#52667A] hover:text-[#0F766E]"><ArrowLeft className="size-4" />{t(categoryCopy[service.category].title, locale)}</Link>
            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,.55fr)] lg:items-start">
              <div className="max-w-4xl"><div className="flex flex-wrap items-center gap-3"><p className="eyebrow">{portal.servicePrototype}</p><Badge variant="outline" className="bg-[#F6F8FB]">{service.mode === 'transaction' ? (hi ? 'काम करने वाला डेमो' : 'Working demo') : service.mode === 'dashboard' ? (hi ? 'काल्पनिक डैशबोर्ड' : 'Synthetic dashboard') : (hi ? 'जानकारी दृश्य' : 'Information view')}</Badge></div><h1 className="mt-4 text-[clamp(2.8rem,6vw,5.8rem)] font-semibold leading-[.92] tracking-[-.045em]">{t(service.title, locale)}</h1><p className="mt-6 max-w-3xl text-xl leading-8 text-[#52667A]">{t(service.description, locale)}</p></div>
              <aside className="border-t-2 border-[#102A43] bg-[#F6F8FB] p-6"><dl className="grid grid-cols-2 gap-5"><div><dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#52667A]"><Clock3 className="size-4" />{portal.expectedTime}</dt><dd className="mt-2 font-semibold">{t(service.duration, locale)}</dd></div><div><dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#52667A]"><IndianRupee className="size-4" />{portal.sampleFee}</dt><dd className="mt-2 font-semibold">{fee}</dd></div></dl><div className="mt-6 border-t pt-6">{service.mode === 'transaction' ? (user ? <ServiceStartButton locale={locale} serviceSlug={service.slug} label={portal.start} renewalFlow={service.renewalFlow} /> : <Button asChild className="h-12 bg-[#0F766E] px-5 text-base hover:bg-[#0B5F59]"><Link href={demoSignInPath(servicePath(locale, service))}>{portal.signIn}<ArrowRight /></Link></Button>) : <Button asChild className="h-12 bg-[#0F766E] px-5 text-base hover:bg-[#0B5F59]"><a href="#prototype-view">{service.mode === 'dashboard' ? portal.openDashboard : portal.readGuide}<ArrowRight /></a></Button>}</div></aside>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <h2 className="text-3xl font-semibold sm:text-4xl">{portal.howItWorks}</h2>
              <ol className="mt-7 border-y">
                {[portal.step1, portal.step2, portal.step3, portal.step4].map((step, index) => <li key={step} className="grid grid-cols-[52px_1fr_auto] items-center gap-4 border-b py-6 last:border-0"><span className="font-heading text-2xl font-semibold text-[#C76A15]">0{index + 1}</span><div><h3 className="text-lg font-semibold">{step}</h3><p className="mt-1 text-sm text-[#52667A]">{stepDescription(index, locale, service.mode)}</p></div><CheckCircle2 className={`size-5 ${index === 3 ? 'text-[#C76A15]' : 'text-[#0F766E]'}`} /></li>)}
              </ol>
            </div>
            <aside>
              <h2 className="text-2xl font-semibold">{portal.requirements}</h2>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-[#40556A]">{[portal.requirement1, portal.requirement2, portal.requirement3].map((item) => <li key={item} className="flex items-start gap-3"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#0F766E]" />{item}</li>)}</ul>
              <Alert className="mt-7 border-[#E3C18D] bg-[#FFF9ED] text-[#5E4200]"><KeyRound /><AlertTitle>{hi ? 'डेमो OTP: 123456' : 'Demo OTP: 123456'}</AlertTitle><AlertDescription>{hi ? 'कोई SMS या वास्तविक पहचान जाँच नहीं।' : 'No SMS or real identity check.'}</AlertDescription></Alert>
            </aside>
          </div>
        </section>

        <section id="prototype-view" className="scroll-mt-6 border-y bg-white py-12 sm:py-16">
          <div className="shell">
            {service.mode === 'dashboard' ? <SyntheticDashboard locale={locale} title={t(service.title, locale)} /> : service.mode === 'information' ? <InformationGuide locale={locale} serviceTitle={t(service.title, locale)} /> : <TransactionPreview locale={locale} />}
          </div>
        </section>

        <section className="py-12 sm:py-16"><div className="shell"><h2 className="text-3xl font-semibold">{portal.related}</h2><div className="mt-6 grid border-y md:grid-cols-3">{related.map((item) => <article key={item.slug} className="group relative border-b p-6 md:border-b-0 md:border-r md:last:border-r-0"><h3 className="text-xl font-semibold"><Link href={servicePath(locale, item)} className="after:absolute after:inset-0">{t(item.title, locale)}</Link></h3><p className="mt-2 text-sm leading-6 text-[#52667A]">{t(item.summary, locale)}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0F766E]">{portal.viewService}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></article>)}</div><Button asChild variant="ghost" className="mt-6 h-11 px-0"><Link href={localPath(locale, '/services')}><ArrowLeft />{portal.backServices}</Link></Button></div></section>
      </main>
    </div>
  );
}

function stepDescription(index: number, locale: 'en' | 'hi', mode: 'transaction' | 'information' | 'dashboard') {
  const en = mode === 'transaction'
    ? ['See requirements and sample fee before doing anything.', 'Choose from safe preset options using fictional records.', 'Use the visible code—no real OTP or identity data.', 'Submit a mock transaction and keep its synthetic reference.']
    : ['Read the scope and source limitations.', 'Explore structured examples rather than live records.', 'See what a production service would verify.', 'Leave with clear next steps and no submitted data.'];
  const hi = mode === 'transaction'
    ? ['कुछ भी करने से पहले आवश्यकताएँ और नमूना शुल्क देखें।', 'काल्पनिक रिकॉर्ड के साथ सुरक्षित पहले से तय विकल्प चुनें।', 'दिखाई देने वाला कोड उपयोग करें—कोई वास्तविक OTP या पहचान डेटा नहीं।', 'मॉक लेनदेन जमा करें और काल्पनिक संदर्भ रखें।']
    : ['दायरा और स्रोत सीमाएँ पढ़ें।', 'लाइव रिकॉर्ड के बजाय संरचित उदाहरण देखें।', 'देखें कि उत्पादन सेवा क्या सत्यापित करेगी।', 'बिना डेटा जमा किए स्पष्ट अगले कदम पाएँ।'];
  return (locale === 'hi' ? hi : en)[index];
}

function SyntheticDashboard({ locale, title }: { locale: 'en' | 'hi'; title: string }) {
  const values = [72, 54, 38, 84];
  const labels = locale === 'hi' ? ['पूर्ण', 'जाँच में', 'नियुक्ति', 'समय पर'] : ['Completed', 'In review', 'Appointments', 'On time'];
  return <div><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">{locale === 'hi' ? 'पूरी तरह काल्पनिक' : 'Entirely synthetic'}</p><h2 className="mt-2 text-3xl font-semibold sm:text-5xl">{title}</h2></div><Badge className="w-fit border border-[#E3C18D] bg-[#FFF9ED] text-[#8A5A00]">SAMPLE DATA</Badge></div><div className="mt-10 grid gap-6 md:grid-cols-4">{values.map((value, index) => <div key={labels[index]} className="border-t-2 border-[#102A43] pt-4"><p className="text-sm font-semibold text-[#52667A]">{labels[index]}</p><p className="mt-2 font-heading text-4xl font-semibold">{value}<span className="text-lg text-[#52667A]">%</span></p><div className="mt-4 h-2 bg-[#E2E8F0]"><div className="h-full bg-[#0F766E]" style={{ width: `${value}%` }} /></div></div>)}</div><Alert className="mt-10 border-[#A9D2CD] bg-[#F1FAF8]"><BarChart3 /><AlertTitle>{locale === 'hi' ? 'ये आधिकारिक आँकड़े नहीं हैं' : 'These are not official statistics'}</AlertTitle><AlertDescription>{locale === 'hi' ? 'चार्ट केवल सुलभ रिपोर्टिंग इंटरफ़ेस दिखाने के लिए बनाया गया है।' : 'The chart exists only to demonstrate an accessible reporting interface.'}</AlertDescription></Alert></div>;
}

function InformationGuide({ locale, serviceTitle }: { locale: 'en' | 'hi'; serviceTitle: string }) {
  const items = locale === 'hi' ? ['काम शुरू करने से पहले पात्रता और आवश्यक दस्तावेज़ पढ़ें।', 'हर पहचान और स्थिति को काल्पनिक या मॉक के रूप में पहचानें।', 'वास्तविक सेवा में फीस, समय और नियम जारी करने वाले प्राधिकरण से सत्यापित करें।'] : ['Read eligibility and required documents before starting.', 'Treat every identity and status shown here as fictional or mocked.', 'In a real service, verify fees, timing, and rules with the issuing authority.'];
  return <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><p className="eyebrow">{locale === 'hi' ? 'सरल भाषा' : 'Plain-language guide'}</p><h2 className="mt-3 text-3xl font-semibold sm:text-5xl">{serviceTitle}</h2><p className="mt-5 text-[#52667A]">{locale === 'hi' ? 'यह अनुभाग लाइव रिकॉर्ड या कानूनी सलाह के बिना सही जानकारी क्रम दिखाता है।' : 'This section demonstrates a useful information order without live records or legal advice.'}</p></div><ol className="border-y">{items.map((item, index) => <li key={item} className="grid grid-cols-[48px_1fr] gap-4 border-b py-6 last:border-0"><span className="font-heading text-2xl font-semibold text-[#C76A15]">0{index + 1}</span><p className="font-semibold leading-7">{item}</p></li>)}</ol></div>;
}

function TransactionPreview({ locale }: { locale: 'en' | 'hi' }) {
  return <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">{locale === 'hi' ? 'सुरक्षित डेमो अनुबंध' : 'Safe demo contract'}</p><h2 className="mt-3 text-3xl font-semibold sm:text-5xl">{locale === 'hi' ? 'एक कार्य, चार स्पष्ट चरण।' : 'One task, four clear steps.'}</h2></div><div className="grid gap-4 sm:grid-cols-2">{[{ icon: FileCheck2, en: 'Prefilled synthetic record', hi: 'पहले से भरा काल्पनिक रिकॉर्ड' }, { icon: KeyRound, en: 'Visible demo verification', hi: 'दिखाई देने वाला डेमो सत्यापन' }, { icon: IndianRupee, en: 'No financial inputs', hi: 'कोई वित्तीय इनपुट नहीं' }, { icon: Sparkles, en: 'Mock receipt and status', hi: 'मॉक रसीद और स्थिति' }].map(({ icon: Icon, en, hi }) => <div key={en} className="flex items-center gap-4 border p-5"><Icon className="size-6 shrink-0 text-[#0F766E]" /><p className="font-semibold">{locale === 'hi' ? hi : en}</p></div>)}</div></div>;
}

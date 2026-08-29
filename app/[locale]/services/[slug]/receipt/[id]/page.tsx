import Link from 'next/link';
import { ArrowLeft, Check, CheckCircle2, Circle, Clock3, FileCheck2, ShieldCheck } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';
import { requireChatGPTUser } from '@/app/chatgpt-auth';
import { PrintButton } from '@/components/print-button';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getServiceApplication } from '@/lib/data';
import { isLocale, localPath } from '@/lib/i18n';
import { getService, portalCopy, servicePath, t } from '@/lib/services';

export const dynamic = 'force-dynamic';

export default async function ServiceReceiptPage({ params }: { params: Promise<{ locale: string; slug: string; id: string }> }) {
  const { locale: rawLocale, slug, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const service = getService(slug);
  if (!service) notFound();
  const user = await requireChatGPTUser(localPath(locale, `/services/${slug}/receipt/${id}`));
  const application = await getServiceApplication(user.userId, id);
  if (!application || application.serviceSlug !== slug) notFound();
  if (application.status === 'Draft') redirect(localPath(locale, `/services/${slug}/apply/${id}`));
  if (!application.submittedAt || !application.reference) notFound();
  const portal = portalCopy[locale];
  const hi = locale === 'hi';
  const dateLocale = hi ? 'hi-IN' : 'en-IN';
  const timeline = hi ? [['जमा', 'काल्पनिक आवेदन और मॉक शुल्क रिकॉर्ड किया गया।'], ['दस्तावेज़ जाँच', 'एक वास्तविक सेवा आवश्यक रिकॉर्ड की जाँच करेगी।'], ['समीक्षा', 'जारी करने वाला प्राधिकरण अनुरोध की समीक्षा करेगा।'], ['पूर्ण', 'नागरिक को अंतिम निर्णय और अगले कदम मिलेंगे।']] : [['Submitted', 'Synthetic application and mock fee recorded.'], ['Document check', 'A real service would validate the required records.'], ['Review', 'The issuing authority would review the request.'], ['Complete', 'The citizen would receive a final decision and next steps.']];

  return <div lang={locale}><SiteHeader locale={locale} user={user} /><main id="main" className="py-10 sm:py-14"><div className="shell max-w-5xl"><div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">{hi ? 'मॉक जमा पूर्ण' : 'Mock submission complete'}</p><h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl">{hi ? 'आपका काल्पनिक आवेदन जमा हो गया।' : 'Your synthetic application is submitted.'}</h1><p className="mt-4 max-w-2xl text-lg text-[#52667A]">{hi ? 'कोई सरकारी आवेदन या भुगतान नहीं बनाया गया। इस संदर्भ को केवल हैकाथॉन डेमो के लिए रखें।' : 'No government application or payment was created. Keep this reference only for the hackathon demo.'}</p></div><PrintButton label={hi ? 'मॉक रसीद प्रिंट करें' : 'Print mock receipt'} /></div>
    <section aria-labelledby="service-receipt" className="mt-10 overflow-hidden rounded-2xl border bg-white shadow-[0_16px_45px_rgba(16,42,67,.07)]"><div className="flex flex-col gap-5 border-b bg-[#F0F9F5] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"><div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-full bg-white text-[#1F7A4C]"><CheckCircle2 /></span><div><h2 id="service-receipt" className="text-2xl font-semibold">{t(service.title, locale)}</h2><p className="text-sm text-[#52667A]">{portal.prototype}</p></div></div><Badge className="w-fit border border-[#9AC9B0] bg-white px-3 py-1 text-[#1F7A4C]"><ShieldCheck />SYNTHETIC</Badge></div><dl className="grid p-6 sm:grid-cols-2 sm:p-8"><ReceiptDatum label={hi ? 'आवेदन संदर्भ' : 'Application reference'} value={application.reference} /><ReceiptDatum label={hi ? 'नमूना शुल्क' : 'Sample fee'} value={`₹${(application.feePaise / 100).toLocaleString('en-IN')} (${hi ? 'मॉक' : 'mock'})`} /><ReceiptDatum label={hi ? 'जमा समय' : 'Submitted on'} value={new Intl.DateTimeFormat(dateLocale, { dateStyle: 'long', timeStyle: 'short' }).format(new Date(application.submittedAt))} /><ReceiptDatum label={hi ? 'सेवा विकल्प' : 'Service option'} value={application.selection || 'standard'} /></dl></section>
    <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_280px]"><section aria-labelledby="timeline-title"><h2 id="timeline-title" className="text-2xl font-semibold sm:text-3xl">{hi ? 'आगे क्या होगा' : 'What happens next'}</h2><ol className="mt-6">{timeline.map(([title, body], index) => { const state = index === 0 ? 'complete' : index === 1 ? 'current' : 'upcoming'; return <li key={title} className="relative grid grid-cols-[40px_1fr] gap-3 pb-8 last:pb-0">{index < timeline.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-8px)] w-0.5 bg-[#CBD5E1]" />}<span className={`relative z-10 grid size-8 place-items-center rounded-full border-2 ${state === 'complete' ? 'border-[#1F7A4C] bg-[#1F7A4C] text-white' : state === 'current' ? 'border-[#0F766E] bg-white text-[#0F766E]' : 'border-[#B8C5D3] bg-[#F6F8FB] text-[#52667A]'}`}>{state === 'complete' ? <Check className="size-4" /> : state === 'current' ? <Clock3 className="size-4" /> : <Circle className="size-3" />}</span><div><div className="flex items-center gap-2"><h3 className="text-lg font-semibold">{title}</h3><span className="text-xs font-bold uppercase tracking-wider text-[#52667A]">{state === 'complete' ? (hi ? 'पूर्ण' : 'Complete') : state === 'current' ? (hi ? 'वर्तमान' : 'Current') : (hi ? 'आगामी' : 'Upcoming')}</span></div><p className="mt-1 text-[#52667A]">{body}</p></div></li>; })}</ol></section><aside className="h-fit border-l-4 border-[#C76A15] bg-white p-6"><FileCheck2 className="text-[#0F766E]" /><h2 className="mt-4 text-lg font-semibold">{hi ? 'अपेक्षित डेमो समय' : 'Expected demo timing'}</h2><p className="mt-1 text-[#52667A]">{hi ? '2–4 काल्पनिक कार्य दिवस' : '2–4 simulated working days'}</p><p className="mt-4 text-xs text-[#52667A]">{portal.prototype}</p></aside></div>
    <div className="no-print mt-12 flex flex-wrap gap-3 border-t pt-7"><Button asChild variant="outline" className="h-11 bg-white"><Link href={localPath(locale, '/dashboard')}><ArrowLeft />{portal.dashboard}</Link></Button><Button asChild variant="ghost" className="h-11"><Link href={servicePath(locale, service)}>{hi ? 'सेवा पर वापस' : 'Back to service'}</Link></Button></div></div></main></div>;
}

function ReceiptDatum({ label, value }: { label: string; value: string }) {
  return <div className="border-b py-5 last:border-b-0 sm:border-b sm:border-r sm:px-5 sm:first:pl-0 sm:even:border-r-0"><dt className="text-sm font-medium text-[#52667A]">{label}</dt><dd className="mt-1 break-words font-mono text-sm font-semibold sm:text-base">{value}</dd></div>;
}

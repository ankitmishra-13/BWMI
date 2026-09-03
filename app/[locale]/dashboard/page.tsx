import Link from 'next/link';
import { ArrowRight, CalendarDays, CarFront, CheckCircle2, Clock3, FileCheck2, MapPin, UserRound } from 'lucide-react';
import { notFound } from 'next/navigation';
import { requireChatGPTUser } from '@/app/chatgpt-auth';
import { AccountShell } from '@/components/account-shell';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureSyntheticCitizen, getCitizenWorkspace } from '@/lib/data';
import { getCopy, isLocale, localPath } from '@/lib/i18n';
import { getService, portalCopy, t } from '@/lib/services';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const copy = getCopy(locale);
  const portal = portalCopy[locale];
  const user = await requireChatGPTUser(localPath(locale, '/dashboard'));
  await ensureSyntheticCitizen(user, locale);
  const { licence, applications, otherApplications } = await getCitizenWorkspace(user.userId);
  if (!licence) throw new Error('Synthetic licence could not be prepared.');
  const dateLocale = locale === 'hi' ? 'hi-IN' : 'en-IN';

  return (
    <div lang={locale} className="civic-paper">
      <SiteHeader locale={locale} user={user} />
      <main id="main" className="py-10 sm:py-14">
        <AccountShell locale={locale} active="overview">
          <p className="eyebrow">{copy.workspaceEyebrow}</p>
          <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div><h1 className="max-w-4xl text-4xl leading-[1.02] tracking-[-.035em] sm:text-6xl">{locale === 'hi' ? 'आपका काल्पनिक परिवहन कार्यक्षेत्र' : 'Your synthetic transport workspace'}</h1><p className="mt-3 text-muted-foreground">{copy.welcome}, {licence.holderName}. {locale === 'hi' ? 'यहाँ कोई वास्तविक नागरिक डेटा नहीं है।' : 'No real citizen data appears here.'}</p></div>
            <Button asChild size="lg"><Link href={localPath(locale, '/readiness')}>{locale === 'hi' ? 'तैयारी जाँच से शुरू करें' : 'Start with readiness check'}<ArrowRight /></Link></Button>
          </div>

          <section aria-labelledby="licence-heading" className="ios-panel mt-10 overflow-hidden">
            <div className="grid lg:grid-cols-[1.45fr_.55fr]">
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div><p className="text-sm font-semibold text-muted-foreground">{copy.licenceLabel}</p><h2 id="licence-heading" className="mt-1 text-3xl tracking-wide">{licence.maskedNumber}</h2></div>
                  <Badge variant="outline" className="bg-[#EAF7EF] text-success"><CheckCircle2 />{copy.eligible}</Badge>
                </div>
                <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  <LicenceDatum icon={UserRound} label={copy.holder} value={licence.holderName} />
                  <LicenceDatum icon={CalendarDays} label={copy.validUntil} value={new Intl.DateTimeFormat(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(licence.validUntil))} />
                  <LicenceDatum icon={CarFront} label={copy.vehicleClasses} value={licence.vehicleClasses} />
                  <LicenceDatum icon={MapPin} label={copy.issuedIn} value={licence.issueState} />
                </dl>
                <div className="mt-7 border-t pt-5"><dt className="text-sm font-medium text-muted-foreground">{copy.address}</dt><dd className="mt-1 font-medium">{licence.address}</dd></div>
              </div>
              <aside className="border-t bg-secondary/65 p-6 lg:border-l lg:border-t-0 lg:p-8">
                <h2 className="text-xl">{copy.whatYouNeed}</h2>
                <ul className="mt-5 flex flex-col gap-4 text-sm text-muted-foreground">
                  {[copy.need1, copy.need2, copy.need3].map((item) => <li key={item} className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-foreground" />{item}</li>)}
                </ul>
              </aside>
            </div>
          </section>

          <section aria-labelledby="history-heading" className="mt-12">
            <div className="flex items-center justify-between gap-4"><h2 id="history-heading" className="text-2xl sm:text-3xl">{copy.applicationHistory}</h2><span className="text-sm text-muted-foreground">{applications.length}</span></div>
            {applications.length === 0 ? <p className="mt-5 border-y py-7 text-muted-foreground">{copy.noApplications}</p> : (
              <div className="ios-panel mt-5 px-6">
                {applications.map((application) => {
                  const submitted = application.status !== 'Draft';
                  const href = submitted ? localPath(locale, `/status/${application.id}`) : localPath(locale, `/renew/${application.id}`);
                  return (
                    <article key={application.id} className="grid gap-4 border-b py-6 last:border-0 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div className="flex items-start gap-4">
                        <span className={`grid size-11 shrink-0 place-items-center rounded-full ${submitted ? 'bg-[#EAF7EF] text-success' : 'bg-secondary text-foreground'}`}>{submitted ? <FileCheck2 /> : <Clock3 />}</span>
                        <div><h3 className="font-heading text-lg font-semibold">{submitted ? copy.submitted : `${copy.stepOf.replace('{current}', String(application.currentStep + 1)).replace('{total}', '6')}`}</h3><p className="mt-1 font-mono text-xs text-muted-foreground">{application.id.slice(0, 8).toUpperCase()} · {new Intl.DateTimeFormat(dateLocale, { dateStyle: 'medium' }).format(new Date(application.updatedAt))}</p></div>
                      </div>
                      <Button asChild variant="outline" className="justify-self-start sm:justify-self-end"><Link href={href}>{submitted ? copy.viewStatus : copy.resumeRenewal}<ArrowRight data-icon="inline-end" /></Link></Button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section aria-labelledby="service-history-heading" className="mt-12">
            <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">{portal.allServices}</p><h2 id="service-history-heading" className="mt-2 text-2xl sm:text-3xl">{locale === 'hi' ? 'अन्य सेवा आवेदन' : 'Other service applications'}</h2></div><Button asChild variant="outline"><Link href={localPath(locale, '/services')}>{portal.allServices}<ArrowRight data-icon="inline-end" /></Link></Button></div>
            {otherApplications.length === 0 ? <p className="mt-5 border-y py-7 text-muted-foreground">{locale === 'hi' ? 'अभी कोई अन्य सेवा आवेदन नहीं है।' : 'No other service applications yet.'}</p> : <div className="ios-panel mt-5 px-6">{otherApplications.map((application) => { const service = getService(application.serviceSlug); if (!service) return null; const submitted = application.status !== 'Draft'; const href = submitted ? localPath(locale, `/services/${service.slug}/receipt/${application.id}`) : localPath(locale, `/services/${service.slug}/apply/${application.id}`); return <article key={application.id} className="grid gap-4 border-b py-6 last:border-0 sm:grid-cols-[1fr_auto] sm:items-center"><div className="flex items-start gap-4"><span className={`grid size-11 shrink-0 place-items-center rounded-full ${submitted ? 'bg-[#EAF7EF] text-success' : 'bg-secondary text-foreground'}`}>{submitted ? <FileCheck2 /> : <Clock3 />}</span><div><h3 className="font-heading text-lg font-semibold">{t(service.title, locale)}</h3><p className="mt-1 text-sm text-muted-foreground">{submitted ? (locale === 'hi' ? 'मॉक आवेदन जमा' : 'Mock application submitted') : (locale === 'hi' ? `चरण ${application.currentStep + 1}, कुल 5` : `Step ${application.currentStep + 1} of 5`)}</p></div></div><Button asChild variant="outline" className="justify-self-start sm:justify-self-end"><Link href={href}>{submitted ? copy.viewStatus : copy.resumeRenewal}<ArrowRight data-icon="inline-end" /></Link></Button></article>; })}</div>}
          </section>
        </AccountShell>
      </main>
    </div>
  );
}

function LicenceDatum({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: string }) {
  return <div className="flex items-start gap-3"><Icon className="mt-1 size-5 shrink-0 text-foreground" aria-hidden="true" /><div><dt className="text-sm font-medium text-muted-foreground">{label}</dt><dd className="mt-0.5 font-semibold">{value}</dd></div></div>;
}

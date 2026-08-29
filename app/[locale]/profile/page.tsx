import { CheckCircle2, Fingerprint, Languages, LockKeyhole, Mail, Phone, UserRound } from 'lucide-react';
import { notFound } from 'next/navigation';
import { requireChatGPTUser } from '@/app/chatgpt-auth';
import { AccountShell } from '@/components/account-shell';
import { SiteHeader } from '@/components/site-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ensureSyntheticCitizen, getCitizenProfile, getCitizenWorkspace } from '@/lib/data';
import { accountCopy } from '@/lib/account-copy';
import { isLocale, localPath } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default async function ProfilePage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const user = await requireChatGPTUser(localPath(locale, '/profile'));
  await ensureSyntheticCitizen(user, locale);
  const [profile, workspace, query] = await Promise.all([getCitizenProfile(user.userId), getCitizenWorkspace(user.userId), searchParams]);
  if (!profile || !workspace.licence) throw new Error('Synthetic profile could not be prepared.');
  const copy = accountCopy[locale];

  return (
    <div className="civic-paper">
      <SiteHeader locale={locale} user={user} />
      <main id="main" className="py-9 sm:py-14">
        <AccountShell locale={locale} active="profile">
          <p className="eyebrow">{copy.profileEyebrow}</p>
          <div className="mt-3 flex flex-col gap-4 border-b pb-8 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-4xl leading-[1.02] tracking-[-.035em] sm:text-6xl">{copy.profileTitle}</h1><p className="mt-4 max-w-2xl text-muted-foreground">{copy.profileBody}</p></div><Badge variant="outline" className="w-fit bg-white"><LockKeyhole />{copy.demoOnly}</Badge></div>

          {query.saved && <Alert className="mt-7 bg-[#EAF7EF] text-success"><CheckCircle2 /><AlertTitle>{copy.profileSaved}</AlertTitle><AlertDescription>{copy.profileBody}</AlertDescription></Alert>}
          {query.error && <Alert variant="destructive" className="mt-7"><AlertTitle>{copy.profileError}</AlertTitle></Alert>}

          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <form action="/api/profile" method="post" className="ios-panel p-6 sm:p-8">
              <div className="mb-7 flex items-center gap-4"><span className="grid size-12 place-items-center rounded-full bg-secondary"><UserRound className="size-5" /></span><div><h2 className="text-2xl">{copy.profile}</h2><p className="text-sm text-muted-foreground">{copy.accountHint}</p></div></div>
              <FieldGroup>
                <Field><FieldLabel htmlFor="fullName">{copy.fullName}</FieldLabel><Input id="fullName" name="fullName" defaultValue={profile.fullName} required minLength={2} maxLength={60} /><FieldDescription>{locale === 'hi' ? 'केवल काल्पनिक नाम उपयोग करें।' : 'Use a fictional name only.'}</FieldDescription></Field>
                <Field><FieldLabel htmlFor="email">{copy.email}</FieldLabel><Input id="email" name="email" type="email" defaultValue={profile.email} required pattern=".+@bwmi\.test" /><FieldDescription>{locale === 'hi' ? 'ईमेल @bwmi.test पर समाप्त होना चाहिए।' : 'The address must end in @bwmi.test.'}</FieldDescription></Field>
                <Field><FieldLabel htmlFor="syntheticPhone">{copy.phone}</FieldLabel><Input id="syntheticPhone" name="syntheticPhone" type="tel" defaultValue={profile.syntheticPhone} required pattern="\+91 [6-9][0-9]{4} [0-9]{5}" /><FieldDescription>+91 98765 78120</FieldDescription></Field>
                <Field><FieldLabel htmlFor="preferredLocale">{copy.language}</FieldLabel><select id="preferredLocale" name="preferredLocale" defaultValue={profile.preferredLocale} className="h-12 w-full rounded-2xl border border-input bg-white px-4 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25"><option value="en">English</option><option value="hi">हिन्दी</option></select></Field>
              </FieldGroup>
              <Button type="submit" size="lg" className="mt-8">{copy.saveProfile}</Button>
            </form>

            <div className="flex flex-col gap-5">
              <section className="ios-panel p-6"><Fingerprint className="size-6" /><h2 className="mt-4 text-xl">{copy.identity}</h2><dl className="mt-5 flex flex-col gap-4 text-sm"><ProfileDatum icon={UserRound} label={copy.fullName} value={profile.fullName} /><ProfileDatum icon={Mail} label={copy.email} value={profile.email} /><ProfileDatum icon={Phone} label={copy.phone} value={profile.syntheticPhone} /><ProfileDatum icon={Languages} label={copy.language} value={profile.preferredLocale === 'hi' ? 'हिन्दी' : 'English'} /></dl><div className="mt-6 border-t pt-5"><p className="text-xs text-muted-foreground">{workspace.licence.maskedNumber}</p><p className="mt-1 font-medium">{workspace.licence.vehicleClasses}</p></div></section>
              <section id="privacy" className="ios-panel scroll-mt-28 bg-secondary/72 p-6"><LockKeyhole className="size-6" /><h2 className="mt-4 text-xl">{copy.privacy}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.privacyBody}</p></section>
            </div>
          </div>
        </AccountShell>
      </main>
    </div>
  );
}

function ProfileDatum({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: string }) {
  return <div className="flex items-start gap-3"><Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><div><dt className="text-xs text-muted-foreground">{label}</dt><dd className="font-medium break-words">{value}</dd></div></div>;
}

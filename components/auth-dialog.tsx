'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, KeyRound, UserPlus } from 'lucide-react';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/lib/demo-auth-config';
import { RegisterFunnel } from '@/components/register-funnel';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { localPath, type Locale } from '@/lib/i18n';

export function AuthDialog({ locale, returnTo, fullWidth = false }: { locale: Locale; returnTo?: string; fullWidth?: boolean }) {
  const hi = locale === 'hi';
  const destination = returnTo ?? localPath(locale, '/dashboard');
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  return <Dialog><DialogTrigger asChild><Button size="sm" className={fullWidth ? 'w-full' : ''}>{hi ? 'साइन इन' : 'Sign in'}<ArrowRight data-icon="inline-end" /></Button></DialogTrigger><DialogContent className={mode === 'register' ? 'sm:max-w-2xl' : 'sm:max-w-md'}><DialogHeader><DialogTitle>{mode === 'signin' ? (hi ? 'Raahi में साइन इन करें' : 'Sign in to Raahi') : (hi ? 'अपना काल्पनिक खाता बनाएँ' : 'Create your synthetic account')}</DialogTitle><DialogDescription>{mode === 'signin' ? (hi ? 'जज डेमो खाते से तुरंत कार्यक्षेत्र खोलें।' : 'Open the judge-ready demo workspace without leaving this page.') : (hi ? 'चार स्पष्ट चरणों में सत्यापन और मॉक DigiLocker लिंक पूरा करें।' : 'Complete verification and mock DigiLocker linking in four clear steps.')}</DialogDescription></DialogHeader><div className="grid grid-cols-2 rounded-xl bg-secondary p-1"><Button type="button" size="sm" variant={mode === 'signin' ? 'default' : 'ghost'} onClick={() => setMode('signin')}><KeyRound data-icon="inline-start" />{hi ? 'साइन इन' : 'Sign in'}</Button><Button type="button" size="sm" variant={mode === 'register' ? 'default' : 'ghost'} onClick={() => setMode('register')}><UserPlus data-icon="inline-start" />{hi ? 'नया खाता' : 'Create account'}</Button></div>{mode === 'signin' ? <form action="/api/demo-auth/login" method="post" className="flex flex-col gap-5"><input type="hidden" name="returnTo" value={destination} /><FieldGroup><Field><FieldLabel htmlFor={`dialog-email-${fullWidth}`}>{hi ? 'ईमेल पता' : 'Email address'}</FieldLabel><Input id={`dialog-email-${fullWidth}`} name="email" type="email" defaultValue={DEMO_EMAIL} autoComplete="username" /><FieldDescription>{hi ? 'सार्वजनिक काल्पनिक डेमो क्रेडेंशियल।' : 'Public synthetic demo credential.'}</FieldDescription></Field><Field><FieldLabel htmlFor={`dialog-password-${fullWidth}`}>{hi ? 'पासवर्ड' : 'Password'}</FieldLabel><Input id={`dialog-password-${fullWidth}`} name="password" type="text" defaultValue={DEMO_PASSWORD} autoComplete="current-password" className="font-mono" /></Field></FieldGroup><Button type="submit" size="lg" className="w-full">{hi ? 'डेमो कार्यक्षेत्र खोलें' : 'Open demo workspace'}<ArrowRight data-icon="inline-end" /></Button><Link href={localPath(locale, `/login?returnTo=${encodeURIComponent(destination)}`)} className="text-center text-xs font-medium text-muted-foreground underline underline-offset-4">{hi ? 'पूरा साइन-इन पेज खोलें' : 'Open full sign-in page'}</Link></form> : <><RegisterFunnel locale={locale} returnTo={destination} compact /><Link href={localPath(locale, `/register?returnTo=${encodeURIComponent(destination)}`)} className="text-center text-xs font-medium text-muted-foreground underline underline-offset-4">{hi ? 'पूरा पंजीकरण पेज खोलें' : 'Open full registration page'}</Link></>}</DialogContent></Dialog>;
}

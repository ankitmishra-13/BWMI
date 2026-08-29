import { NextResponse } from 'next/server';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { updateSyntheticProfile } from '@/lib/data';
import { syntheticProfileSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const formData = await request.formData();
  const parsed = syntheticProfileSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    syntheticPhone: formData.get('syntheticPhone'),
    preferredLocale: formData.get('preferredLocale'),
  });
  const locale = formData.get('preferredLocale') === 'hi' ? 'hi' : 'en';
  const target = new URL(`/${locale}/profile`, request.url);
  if (!parsed.success) {
    target.searchParams.set('error', '1');
    return NextResponse.redirect(target, 303);
  }
  await updateSyntheticProfile(user.userId, parsed.data);
  target.searchParams.set('saved', '1');
  return NextResponse.redirect(target, 303);
}

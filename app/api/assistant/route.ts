import { NextResponse } from 'next/server';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { getApplicationBundle, recordAssistantRequest } from '@/lib/data';
import { assistantSchema } from '@/lib/validation';

const stepContext = [
  'eligibility, renewal window, and requirements',
  'synthetic contact and address details',
  'document metadata selection without uploading bytes',
  'the visible mock OTP 123456',
  'review and synthetic-data declarations',
  'the ₹450 mock payment and receipt',
] as const;

const fallbackEn = [
  'This step checks whether the synthetic licence is inside the demo renewal window. A real service would verify eligibility with the issuing authority.',
  'Review the synthetic email, phone number, and address. These details stay in your signed-in prototype workspace.',
  'Choose a sample address-proof file. Only its filename and size are stored; the file itself is never uploaded.',
  'Use 123456. It is a visible demo code, and no SMS or identity verification takes place.',
  'Check every change and accept both declarations. They make clear that the data and submission are simulated.',
  'The prototype records a ₹450 mock payment and creates a receipt. It never asks for card, bank, or UPI details.',
] as const;
const fallbackHi = [
  'यह चरण जाँचता है कि काल्पनिक लाइसेंस डेमो की नवीनीकरण अवधि में है। वास्तविक सेवा जारी करने वाले प्राधिकरण से पात्रता जाँचेगी।',
  'काल्पनिक ईमेल, फोन और पता जाँचें। ये केवल आपके साइन-इन प्रोटोटाइप कार्यक्षेत्र में रहते हैं।',
  'पते के प्रमाण की नमूना फ़ाइल चुनें। केवल फ़ाइल का नाम और आकार सहेजा जाता है; फ़ाइल अपलोड नहीं होती।',
  '123456 का उपयोग करें। यह दिखाई देने वाला डेमो कोड है; कोई SMS या पहचान सत्यापन नहीं होता।',
  'हर बदलाव जाँचें और दोनों घोषणाएँ स्वीकार करें। वे स्पष्ट करती हैं कि डेटा और आवेदन सिम्युलेटेड हैं।',
  'प्रोटोटाइप ₹450 का मॉक भुगतान दर्ज कर रसीद बनाता है। यह कार्ड, बैंक या UPI विवरण नहीं माँगता।',
] as const;

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const parsed = assistantSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Ask a question of 3–300 characters.' }, { status: 400 });
  const { applicationId, step, locale, question } = parsed.data;
  if (!await getApplicationBundle(user.userId, applicationId)) {
    return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
  }
  if (/\b\d{10,}\b|[\w.+-]+@[\w.-]+\.[a-z]{2,}|\b[A-Z]{2}[- ]?\d{2,}/i.test(question)) {
    return NextResponse.json({ error: 'Please remove personal identifiers and ask a general question.' }, { status: 400 });
  }
  if (!await recordAssistantRequest(user.userId, applicationId, step, question.length)) {
    return NextResponse.json({ error: 'Question limit reached. Use the built-in step guidance for now.' }, { status: 429 });
  }

  const fallback = locale === 'hi' ? fallbackHi[step] : fallbackEn[step];
  const suggestions = locale === 'hi'
    ? ['मुझे अब क्या करना है?', 'यह जानकारी क्यों चाहिए?', 'आगे क्या होगा?']
    : ['What do I do now?', 'Why is this needed?', 'What happens next?'];
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ answer: fallback, suggestions, fallback: true });

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-5.6-luna',
        reasoning: { effort: 'low' },
        max_output_tokens: 220,
        instructions: `You are a concise civic-form explainer for a hackathon prototype. Reply in ${locale === 'hi' ? 'Hindi' : 'English'}. Explain only the current prototype step. Never assess legal eligibility, request personal data, claim government access, or imply an official submission.`,
        input: `Current step: ${stepContext[step]}. Synthetic requirements only. Citizen question: ${question}`,
      }),
    });
    if (!response.ok) throw new Error('AI unavailable');
    const data = await response.json() as { output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
    const answer = data.output?.flatMap((item) => item.content ?? []).find((item) => item.type === 'output_text')?.text;
    if (!answer) throw new Error('No answer');
    return NextResponse.json({ answer, suggestions, fallback: false });
  } catch {
    return NextResponse.json({ answer: fallback, suggestions, fallback: true });
  }
}

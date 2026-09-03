import type { Locale } from '@/lib/i18n';
import type { ReadinessCopilotOutput, ReadinessInput } from '@/lib/validation';

export type ReadinessItem = {
  id: string;
  title: Record<Locale, string>;
  reason: Record<Locale, string>;
};

export type ReadinessResult = {
  status: 'ready' | 'attention';
  medicalRequired: boolean;
  visitExpected: boolean;
  estimatedMinutes: string;
  feePaise: number;
  documents: ReadinessItem[];
  blockers: ReadinessItem[];
  readyItems: ReadinessItem[];
};

const item = (id: string, titleEn: string, titleHi: string, reasonEn: string, reasonHi: string): ReadinessItem => ({
  id,
  title: { en: titleEn, hi: titleHi },
  reason: { en: reasonEn, hi: reasonHi },
});

export const readinessSources = [
  {
    label: { en: 'Official renewal overview', hi: 'आधिकारिक नवीनीकरण जानकारी' },
    href: 'https://mparivahan.parivahan.gov.in/mstatic/english/dl-info-renewal-dl.html',
  },
  {
    label: { en: 'Official Form 2', hi: 'आधिकारिक फॉर्म 2' },
    href: 'https://parivahan.gov.in/parivahan/sites/default/files/DownloadForm/cmvr/FORM-2.pdf',
  },
] as const;

export function evaluateReadiness(input: ReadinessInput): ReadinessResult {
  const medicalRequired = input.ageBand !== 'under-40' || input.licenceType === 'transport';
  const visitExpected = input.servicePreference === 'assisted' || input.licenceType === 'transport' || input.expirySituation === 'expired-over-year';
  const documents: ReadinessItem[] = [
    item('licence', 'Synthetic driving licence record', 'काल्पनिक ड्राइविंग लाइसेंस रिकॉर्ड', 'The renewal must be connected to an existing licence record.', 'नवीनीकरण को मौजूदा लाइसेंस रिकॉर्ड से जोड़ना होता है।'),
    item('form-2', 'Form 2 details', 'फॉर्म 2 का विवरण', 'This is the standard application form represented by the guided questions.', 'निर्देशित प्रश्न इसी मानक आवेदन फॉर्म को सरल रूप में दिखाते हैं।'),
    medicalRequired
      ? item('form-1a', 'Sample Form 1A medical certificate', 'नमूना फॉर्म 1A मेडिकल प्रमाणपत्र', 'The prototype flags this for transport licences or citizens aged 40 and above.', 'प्रोटोटाइप इसे परिवहन लाइसेंस या 40 वर्ष और उससे अधिक आयु के लिए दिखाता है।')
      : item('form-1', 'Sample Form 1 fitness declaration', 'नमूना फॉर्म 1 स्वास्थ्य घोषणा', 'The prototype uses a self-declaration for a private licence below age 40.', 'प्रोटोटाइप 40 वर्ष से कम आयु के निजी लाइसेंस के लिए स्व-घोषणा दिखाता है।'),
  ];
  if (input.addressChanged) documents.push(item('address', 'Synthetic address proof', 'काल्पनिक पते का प्रमाण', 'You said the address has changed, so the new fictional address must be supported.', 'आपने पता बदलने की बात कही है, इसलिए नए काल्पनिक पते का प्रमाण चाहिए।'));

  const blockers: ReadinessItem[] = [];
  if (input.expirySituation === 'expired-over-year') blockers.push(item('late-renewal', 'Additional checks may be needed', 'अतिरिक्त जाँच की आवश्यकता हो सकती है', 'A licence expired for more than one year may require extra steps. This prototype does not make the legal decision.', 'एक वर्ष से अधिक समय से समाप्त लाइसेंस में अतिरिक्त चरण हो सकते हैं। यह प्रोटोटाइप कानूनी निर्णय नहीं करता।'));
  if (input.licenceType === 'transport') blockers.push(item('transport-check', 'Transport-licence review', 'परिवहन लाइसेंस की समीक्षा', 'Transport categories can require an authority review and a medical certificate.', 'परिवहन श्रेणियों में प्राधिकरण समीक्षा और मेडिकल प्रमाणपत्र की आवश्यकता हो सकती है।'));

  const readyItems = [
    item('language', input.preferredLocale === 'hi' ? 'Hindi guidance selected' : 'English guidance selected', input.preferredLocale === 'hi' ? 'हिन्दी मार्गदर्शन चुना गया' : 'अंग्रेज़ी मार्गदर्शन चुना गया', 'The selected language stays with the saved journey.', 'चुनी गई भाषा सहेजी गई प्रक्रिया में बनी रहती है।'),
    item('draft', 'Draft and recovery enabled', 'ड्राफ्ट और रिकवरी उपलब्ध', 'Every completed step is saved and can be resumed.', 'हर पूरा चरण सहेजा जाता है और बाद में जारी रखा जा सकता है।'),
    item('payment', 'Credential-free mock payment', 'बिना वित्तीय जानकारी का मॉक भुगतान', 'No card number, UPI ID, or bank login is requested.', 'कार्ड नंबर, UPI ID या बैंक लॉगिन नहीं माँगा जाता।'),
  ];

  return {
    status: blockers.length > 0 ? 'attention' : 'ready',
    medicalRequired,
    visitExpected,
    estimatedMinutes: input.servicePreference === 'assisted' ? '10–12' : '6–8',
    feePaise: 45000,
    documents,
    blockers,
    readyItems,
  };
}

export function interpretCitizenMessage(message: string, locale: Locale): ReadinessCopilotOutput {
  const normalized = message.toLowerCase();
  const fields: ReadinessCopilotOutput['fields'] = { preferredLocale: locale };
  const age = Number(normalized.match(/\b(1[89]|[2-9]\d|1[01]\d)\b/)?.[1]);
  if (age) fields.ageBand = age < 40 ? 'under-40' : age < 60 ? '40-59' : '60-plus';
  if (/transport|commercial|taxi|truck|bus|व्यावसायिक|परिवहन|कमर्शियल/u.test(normalized)) fields.licenceType = 'transport';
  else if (/private|personal|car|bike|निजी|कार|बाइक/u.test(normalized)) fields.licenceType = 'private';
  if (/expired (for )?more than (a |one )?year|expired over (a |one )?year|एक (साल|वर्ष) से (अधिक|ज़्यादा)|एक (साल|वर्ष) से पहले/u.test(normalized)) fields.expirySituation = 'expired-over-year';
  else if (/expired (for )?less than (a |one )?year|expired under (a |one )?year|already expired|has expired|expire ho gaya|समाप्त हो गया|खत्म हो गया/u.test(normalized)) fields.expirySituation = 'expired-under-year';
  else if (/next|soon|month|expire|जल्द|अगले|समाप्त होने|खत्म होने/u.test(normalized)) fields.expirySituation = 'within-year';
  else if (/valid|not expiring|एक साल से अधिक/u.test(normalized)) fields.expirySituation = 'more-than-year';
  if (/delhi|दिल्ली/u.test(normalized)) fields.issueState = 'Delhi';
  else if (/maharashtra|महाराष्ट्र|mumbai|मुंबई/u.test(normalized)) fields.issueState = 'Maharashtra';
  else if (/karnataka|कर्नाटक|bengaluru|bangalore|बेंगलुरु/u.test(normalized)) fields.issueState = 'Karnataka';
  if (/address.*(changed|change)|पता.*(बदल|नया)/u.test(normalized)) fields.addressChanged = true;
  if (/help|centre|center|assisted|सहायता|केंद्र/u.test(normalized)) fields.servicePreference = 'assisted';
  else if (/online|myself|खुद|ऑनलाइन/u.test(normalized)) fields.servicePreference = 'standard';

  const understood = Object.keys(fields).length - 1;
  return {
    fields,
    summary: locale === 'hi'
      ? `मैंने आपकी बात से ${understood} उपयोगी ${understood === 1 ? 'विवरण' : 'विवरण'} समझे हैं। नीचे उन्हें जाँचें—आप हर उत्तर बदल सकते हैं।`
      : `I understood ${understood} useful ${understood === 1 ? 'detail' : 'details'}. Check them below—you can change every answer.`,
    followUp: locale === 'hi' ? 'जो जानकारी नहीं मिली है, उसे नीचे चुनें।' : 'Choose any details I could not find below.',
  };
}

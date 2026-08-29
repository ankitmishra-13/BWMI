import type { Locale } from '@/lib/i18n';

export type LocalText = { en: string; hi: string };
export type ServiceCategory = 'licence' | 'vehicle' | 'compliance' | 'industry' | 'insights' | 'guides';
export type ServiceMode = 'transaction' | 'information' | 'dashboard';

export type TransportService = {
  slug: string;
  category: ServiceCategory;
  title: LocalText;
  summary: LocalText;
  description: LocalText;
  duration: LocalText;
  feePaise: number | null;
  mode: ServiceMode;
  popular?: boolean;
  renewalFlow?: boolean;
};

export const categoryCopy: Record<ServiceCategory, { title: LocalText; short: LocalText; description: LocalText }> = {
  licence: {
    title: { en: 'Driving licence', hi: 'ड्राइविंग लाइसेंस' },
    short: { en: 'Licence', hi: 'लाइसेंस' },
    description: { en: 'Learn, apply, renew, replace, book a test, or track an application.', hi: 'सीखें, आवेदन करें, नवीनीकरण करें, बदलें, परीक्षा बुक करें या आवेदन देखें।' },
  },
  vehicle: {
    title: { en: 'Vehicle services', hi: 'वाहन सेवाएँ' },
    short: { en: 'Vehicle', hi: 'वाहन' },
    description: { en: 'Registration, ownership, fitness, tax, permits, and vehicle records.', hi: 'पंजीकरण, स्वामित्व, फिटनेस, कर, परमिट और वाहन रिकॉर्ड।' },
  },
  compliance: {
    title: { en: 'Safety & compliance', hi: 'सुरक्षा और अनुपालन' },
    short: { en: 'Safety', hi: 'सुरक्षा' },
    description: { en: 'Challans, pollution certificates, virtual documents, and contact updates.', hi: 'चालान, प्रदूषण प्रमाणपत्र, वर्चुअल दस्तावेज़ और संपर्क अपडेट।' },
  },
  industry: {
    title: { en: 'Manufacturer services', hi: 'निर्माता सेवाएँ' },
    short: { en: 'Industry', hi: 'उद्योग' },
    description: { en: 'Synthetic overviews for makers, device ecosystems, and homologation.', hi: 'निर्माताओं, डिवाइस प्रणालियों और होमोलॉगेशन के काल्पनिक विवरण।' },
  },
  insights: {
    title: { en: 'Dashboards & reports', hi: 'डैशबोर्ड और रिपोर्ट' },
    short: { en: 'Reports', hi: 'रिपोर्ट' },
    description: { en: 'Accessible mock summaries of national transport service activity.', hi: 'राष्ट्रीय परिवहन सेवा गतिविधि के सुलभ काल्पनिक सारांश।' },
  },
  guides: {
    title: { en: 'Guides & information', hi: 'मार्गदर्शिका और जानकारी' },
    short: { en: 'Guides', hi: 'मार्गदर्शिका' },
    description: { en: 'Fees, citizen guides, FAQs, rules, and advisories in plain language.', hi: 'शुल्क, नागरिक गाइड, सामान्य प्रश्न, नियम और सलाह सरल भाषा में।' },
  },
};

const text = (en: string, hi: string): LocalText => ({ en, hi });

export const services: TransportService[] = [
  { slug: 'learner-licence', category: 'licence', title: text('Apply for a learner licence', 'लर्नर लाइसेंस के लिए आवेदन'), summary: text('Understand eligibility and simulate a first application.', 'पात्रता समझें और पहला आवेदन सिम्युलेट करें।'), description: text('A guided synthetic application with state selection, vehicle class, demo verification, and a mock acknowledgement.', 'राज्य, वाहन श्रेणी, डेमो सत्यापन और मॉक पावती के साथ निर्देशित काल्पनिक आवेदन।'), duration: text('8 minute demo', '8 मिनट का डेमो'), feePaise: 20000, mode: 'transaction', popular: true },
  { slug: 'permanent-driving-licence', category: 'licence', title: text('Permanent driving licence', 'स्थायी ड्राइविंग लाइसेंस'), summary: text('Simulate applying after the learner period.', 'लर्नर अवधि के बाद आवेदन सिम्युलेट करें।'), description: text('Review the synthetic learner record, choose a vehicle class, select a test office, and create a mock application.', 'काल्पनिक लर्नर रिकॉर्ड देखें, वाहन श्रेणी और परीक्षा कार्यालय चुनें, फिर मॉक आवेदन बनाएँ।'), duration: text('10 minute demo', '10 मिनट का डेमो'), feePaise: 50000, mode: 'transaction' },
  { slug: 'renew-driving-licence', category: 'licence', title: text('Renew a driving licence', 'ड्राइविंग लाइसेंस नवीनीकरण'), summary: text('Complete the showcase eligibility-to-receipt journey.', 'मुख्य पात्रता-से-रसीद प्रक्रिया पूरी करें।'), description: text('The most complete prototype flow: eligibility, details, document metadata, visible demo OTP, declarations, mock payment, receipt, and status.', 'सबसे पूर्ण प्रोटोटाइप: पात्रता, विवरण, दस्तावेज़ मेटाडेटा, दिखाई देने वाला डेमो OTP, घोषणाएँ, मॉक भुगतान, रसीद और स्थिति।'), duration: text('5 minute demo', '5 मिनट का डेमो'), feePaise: 45000, mode: 'transaction', popular: true, renewalFlow: true },
  { slug: 'duplicate-driving-licence', category: 'licence', title: text('Replace a lost or damaged licence', 'खोया या क्षतिग्रस्त लाइसेंस बदलें'), summary: text('Create a synthetic duplicate-licence request.', 'काल्पनिक डुप्लिकेट लाइसेंस अनुरोध बनाएँ।'), description: text('Choose a reason, confirm the synthetic licence, complete demo verification, and generate a mock reference.', 'कारण चुनें, काल्पनिक लाइसेंस की पुष्टि करें, डेमो सत्यापन पूरा करें और मॉक संदर्भ पाएँ।'), duration: text('6 minute demo', '6 मिनट का डेमो'), feePaise: 40000, mode: 'transaction' },
  { slug: 'driving-test-appointment', category: 'licence', title: text('Book a driving test', 'ड्राइविंग टेस्ट बुक करें'), summary: text('Choose a synthetic RTO, date window, and vehicle class.', 'काल्पनिक RTO, तिथि अवधि और वाहन श्रेणी चुनें।'), description: text('A safe appointment simulation with no connection to a real RTO calendar.', 'वास्तविक RTO कैलेंडर से जुड़े बिना सुरक्षित अपॉइंटमेंट सिमुलेशन।'), duration: text('4 minute demo', '4 मिनट का डेमो'), feePaise: 30000, mode: 'transaction', popular: true },
  { slug: 'driving-school-licence', category: 'licence', title: text('Driving school licence', 'ड्राइविंग स्कूल लाइसेंस'), summary: text('Explore a synthetic school-licensing request.', 'काल्पनिक स्कूल लाइसेंस अनुरोध देखें।'), description: text('Review sample premises and instructor requirements, select a district, and submit a mock request.', 'नमूना परिसर और प्रशिक्षक आवश्यकताएँ देखें, जिला चुनें और मॉक अनुरोध जमा करें।'), duration: text('7 minute demo', '7 मिनट का डेमो'), feePaise: 250000, mode: 'transaction' },
  { slug: 'licence-application-status', category: 'licence', title: text('Track a licence application', 'लाइसेंस आवेदन ट्रैक करें'), summary: text('View a clear synthetic status timeline.', 'स्पष्ट काल्पनिक स्थिति टाइमलाइन देखें।'), description: text('Follow a fictional application from submission through document checking and approval.', 'काल्पनिक आवेदन को जमा होने से दस्तावेज़ जाँच और स्वीकृति तक देखें।'), duration: text('Instant', 'तुरंत'), feePaise: null, mode: 'information' },

  { slug: 'vehicle-registration', category: 'vehicle', title: text('Register a vehicle', 'वाहन पंजीकरण'), summary: text('Simulate a new private-vehicle registration.', 'नए निजी वाहन का पंजीकरण सिम्युलेट करें।'), description: text('Review synthetic dealer and vehicle data, choose a registering office, and create a mock receipt.', 'काल्पनिक डीलर और वाहन डेटा देखें, कार्यालय चुनें और मॉक रसीद बनाएँ।'), duration: text('8 minute demo', '8 मिनट का डेमो'), feePaise: 60000, mode: 'transaction', popular: true },
  { slug: 'transfer-ownership', category: 'vehicle', title: text('Transfer vehicle ownership', 'वाहन स्वामित्व हस्तांतरण'), summary: text('Guide a fictional buyer and seller through transfer.', 'काल्पनिक खरीदार और विक्रेता को हस्तांतरण में मार्गदर्शन।'), description: text('Confirm a synthetic vehicle, choose a transfer reason, verify with the visible demo code, and submit.', 'काल्पनिक वाहन की पुष्टि करें, हस्तांतरण कारण चुनें, दिखाई देने वाले डेमो कोड से सत्यापित करें और जमा करें।'), duration: text('8 minute demo', '8 मिनट का डेमो'), feePaise: 50000, mode: 'transaction', popular: true },
  { slug: 'change-address-rc', category: 'vehicle', title: text('Change address on RC', 'RC पर पता बदलें'), summary: text('Simulate updating a registration address.', 'पंजीकरण पता अपडेट करना सिम्युलेट करें।'), description: text('Compare the old synthetic address with a sample new district, then create a mock application.', 'पुराने काल्पनिक पते की नमूना नए जिले से तुलना करें और मॉक आवेदन बनाएँ।'), duration: text('5 minute demo', '5 मिनट का डेमो'), feePaise: 30000, mode: 'transaction' },
  { slug: 'duplicate-rc', category: 'vehicle', title: text('Request a duplicate RC', 'डुप्लिकेट RC अनुरोध'), summary: text('Replace a fictional lost or damaged certificate.', 'काल्पनिक खोया या क्षतिग्रस्त प्रमाणपत्र बदलें।'), description: text('Choose the reason, confirm sample vehicle details, and submit through a synthetic verification flow.', 'कारण चुनें, नमूना वाहन विवरण की पुष्टि करें और काल्पनिक सत्यापन से जमा करें।'), duration: text('6 minute demo', '6 मिनट का डेमो'), feePaise: 35000, mode: 'transaction' },
  { slug: 'fitness-renewal', category: 'vehicle', title: text('Renew vehicle fitness', 'वाहन फिटनेस नवीनीकरण'), summary: text('Plan a synthetic commercial-vehicle inspection.', 'काल्पनिक वाणिज्यिक वाहन निरीक्षण योजना।'), description: text('Review mock pre-checks, choose an inspection window, and receive an example acknowledgement.', 'मॉक पूर्व-जाँच देखें, निरीक्षण अवधि चुनें और उदाहरण पावती पाएँ।'), duration: text('7 minute demo', '7 मिनट का डेमो'), feePaise: 75000, mode: 'transaction' },
  { slug: 'vehicle-tax', category: 'vehicle', title: text('Pay vehicle tax', 'वाहन कर भुगतान'), summary: text('Simulate a quarterly or annual tax payment.', 'त्रैमासिक या वार्षिक कर भुगतान सिम्युलेट करें।'), description: text('Choose a sample tax period and create a mock payment receipt without entering financial details.', 'नमूना कर अवधि चुनें और वित्तीय विवरण दिए बिना मॉक भुगतान रसीद बनाएँ।'), duration: text('4 minute demo', '4 मिनट का डेमो'), feePaise: 125000, mode: 'transaction' },
  { slug: 'national-permit', category: 'vehicle', title: text('National permit', 'राष्ट्रीय परमिट'), summary: text('Explore a synthetic commercial permit request.', 'काल्पनिक वाणिज्यिक परमिट अनुरोध देखें।'), description: text('Select a sample vehicle type and permit period, then produce a mock acknowledgement.', 'नमूना वाहन प्रकार और परमिट अवधि चुनें, फिर मॉक पावती बनाएँ।'), duration: text('9 minute demo', '9 मिनट का डेमो'), feePaise: 150000, mode: 'transaction' },
  { slug: 'fancy-number', category: 'vehicle', title: text('Fancy number allocation', 'पसंदीदा नंबर आवंटन'), summary: text('Try a fictional number-preference flow.', 'काल्पनिक पसंदीदा नंबर प्रक्रिया आज़माएँ।'), description: text('Browse sample number groups, select one, and create a mock reservation. No auction or payment is real.', 'नमूना नंबर समूह देखें, एक चुनें और मॉक आरक्षण बनाएँ। कोई नीलामी या भुगतान वास्तविक नहीं है।'), duration: text('5 minute demo', '5 मिनट का डेमो'), feePaise: 500000, mode: 'transaction' },

  { slug: 'echallan', category: 'compliance', title: text('Check and pay eChallan', 'ई-चालान जाँच और भुगतान'), summary: text('Review a fictional challan and simulate payment.', 'काल्पनिक चालान देखें और भुगतान सिम्युलेट करें।'), description: text('Use a prefilled synthetic vehicle record, understand the offence, and generate a mock paid receipt without card or UPI data.', 'पहले से भरे काल्पनिक वाहन रिकॉर्ड से उल्लंघन समझें और कार्ड या UPI डेटा के बिना मॉक भुगतान रसीद बनाएँ।'), duration: text('4 minute demo', '4 मिनट का डेमो'), feePaise: 100000, mode: 'transaction', popular: true },
  { slug: 'pucc', category: 'compliance', title: text('Pollution certificate (PUCC)', 'प्रदूषण प्रमाणपत्र (PUCC)'), summary: text('Check fictional certificate validity and next steps.', 'काल्पनिक प्रमाणपत्र की वैधता और अगले कदम देखें।'), description: text('See a synthetic emission-test result, expiry date, and nearby-centre guidance without sharing location.', 'स्थान साझा किए बिना काल्पनिक उत्सर्जन परिणाम, समाप्ति तिथि और केंद्र मार्गदर्शन देखें।'), duration: text('Instant', 'तुरंत'), feePaise: null, mode: 'information', popular: true },
  { slug: 'virtual-documents', category: 'compliance', title: text('Virtual DL and RC', 'वर्चुअल DL और RC'), summary: text('Preview a synthetic mobile document wallet.', 'काल्पनिक मोबाइल दस्तावेज़ वॉलेट देखें।'), description: text('Learn how a verified digital document could be presented. The prototype creates no legal document or scannable government code.', 'जानें कि सत्यापित डिजिटल दस्तावेज़ कैसे दिख सकता है। यह प्रोटोटाइप कोई कानूनी दस्तावेज़ या सरकारी स्कैन कोड नहीं बनाता।'), duration: text('Instant', 'तुरंत'), feePaise: null, mode: 'information' },
  { slug: 'update-mobile-number', category: 'compliance', title: text('Update mobile number', 'मोबाइल नंबर अपडेट'), summary: text('Understand a safe synthetic contact-update path.', 'सुरक्षित काल्पनिक संपर्क अपडेट प्रक्रिया समझें।'), description: text('Review the steps using masked sample data. The prototype never asks for Aadhaar, a real mobile number, or a real OTP.', 'छिपे नमूना डेटा से चरण देखें। प्रोटोटाइप आधार, वास्तविक मोबाइल नंबर या वास्तविक OTP नहीं माँगता।'), duration: text('5 minute demo', '5 मिनट का डेमो'), feePaise: null, mode: 'transaction' },

  { slug: 'vltd-maker', category: 'industry', title: text('VLTD maker overview', 'VLTD निर्माता विवरण'), summary: text('Explore a mock vehicle-location device workflow.', 'मॉक वाहन-स्थान डिवाइस प्रक्रिया देखें।'), description: text('An informational prototype for manufacturer onboarding, test status, and model approvals.', 'निर्माता ऑनबोर्डिंग, परीक्षण स्थिति और मॉडल स्वीकृति का सूचनात्मक प्रोटोटाइप।'), duration: text('Overview', 'विवरण'), feePaise: null, mode: 'information' },
  { slug: 'sld-maker', category: 'industry', title: text('SLD maker overview', 'SLD निर्माता विवरण'), summary: text('See the synthetic speed-limiting-device lifecycle.', 'काल्पनिक गति-सीमित डिवाइस जीवनचक्र देखें।'), description: text('A plain-language view of registration, device testing, fitment, and status.', 'पंजीकरण, डिवाइस परीक्षण, फिटमेंट और स्थिति का सरल दृश्य।'), duration: text('Overview', 'विवरण'), feePaise: null, mode: 'information' },
  { slug: 'cng-maker', category: 'industry', title: text('CNG maker overview', 'CNG निर्माता विवरण'), summary: text('Review a mock clean-fuel kit approval path.', 'मॉक स्वच्छ-ईंधन किट स्वीकृति प्रक्रिया देखें।'), description: text('An independent educational view of sample application, testing, and approval stages.', 'नमूना आवेदन, परीक्षण और स्वीकृति चरणों का स्वतंत्र शैक्षिक दृश्य।'), duration: text('Overview', 'विवरण'), feePaise: null, mode: 'information' },
  { slug: 'homologation', category: 'industry', title: text('Vehicle homologation', 'वाहन होमोलॉगेशन'), summary: text('Explore a synthetic type-approval lifecycle.', 'काल्पनिक प्रकार-स्वीकृति जीवनचक्र देखें।'), description: text('See how model information, test stages, observations, and approvals could be organised.', 'देखें कि मॉडल जानकारी, परीक्षण चरण, टिप्पणियाँ और स्वीकृतियाँ कैसे व्यवस्थित हो सकती हैं।'), duration: text('Overview', 'विवरण'), feePaise: null, mode: 'information' },

  { slug: 'vehicle-dashboard', category: 'insights', title: text('Vehicle registration dashboard', 'वाहन पंजीकरण डैशबोर्ड'), summary: text('Read a fictional national registration snapshot.', 'काल्पनिक राष्ट्रीय पंजीकरण सारांश पढ़ें।'), description: text('Accessible sample trends by fuel, vehicle class, and month. Every number is synthetic.', 'ईंधन, वाहन श्रेणी और महीने के अनुसार सुलभ नमूना रुझान। हर संख्या काल्पनिक है।'), duration: text('Interactive overview', 'इंटरैक्टिव विवरण'), feePaise: null, mode: 'dashboard' },
  { slug: 'licence-dashboard', category: 'insights', title: text('Licence services dashboard', 'लाइसेंस सेवा डैशबोर्ड'), summary: text('Read a fictional service-performance snapshot.', 'काल्पनिक सेवा-प्रदर्शन सारांश पढ़ें।'), description: text('Sample application volumes, processing stages, and completion times with no official statistics.', 'बिना आधिकारिक आँकड़ों के नमूना आवेदन मात्रा, प्रक्रिया चरण और पूर्णता समय।'), duration: text('Interactive overview', 'इंटरैक्टिव विवरण'), feePaise: null, mode: 'dashboard' },

  { slug: 'fees-and-charges', category: 'guides', title: text('Fees and charges guide', 'शुल्क और प्रभार गाइड'), summary: text('Compare clearly labelled sample fees.', 'स्पष्ट रूप से चिह्नित नमूना शुल्क तुलना।'), description: text('A prototype fee index for the service demos. It is not a legal or official fee schedule.', 'सेवा डेमो के लिए प्रोटोटाइप शुल्क सूची। यह कानूनी या आधिकारिक शुल्क तालिका नहीं है।'), duration: text('Guide', 'गाइड'), feePaise: null, mode: 'information' },
  { slug: 'citizen-guide', category: 'guides', title: text('Citizen guide', 'नागरिक गाइड'), summary: text('Understand records, offices, documents, and recovery.', 'रिकॉर्ड, कार्यालय, दस्तावेज़ और समाधान समझें।'), description: text('Plain-language explanations for the concepts used throughout the independent prototype.', 'स्वतंत्र प्रोटोटाइप में उपयोग अवधारणाओं की सरल व्याख्या।'), duration: text('Guide', 'गाइड'), feePaise: null, mode: 'information' },
  { slug: 'frequently-asked-questions', category: 'guides', title: text('Frequently asked questions', 'सामान्य प्रश्न'), summary: text('Get direct answers about the mock portal.', 'मॉक पोर्टल के बारे में सीधे उत्तर पाएँ।'), description: text('What is synthetic, what is saved, what never leaves the prototype, and where real services would differ.', 'क्या काल्पनिक है, क्या सहेजा जाता है, क्या प्रोटोटाइप से बाहर नहीं जाता और वास्तविक सेवाएँ कहाँ अलग होंगी।'), duration: text('Guide', 'गाइड'), feePaise: null, mode: 'information' },
  { slug: 'rules-and-advisories', category: 'guides', title: text('Rules and advisories', 'नियम और सलाह'), summary: text('Read prototype-only safety and process notes.', 'केवल प्रोटोटाइप सुरक्षा और प्रक्रिया नोट पढ़ें।'), description: text('A concise signpost to the kind of authoritative guidance a production service must provide. It does not reproduce legal advice.', 'उत्पादन सेवा में आवश्यक आधिकारिक मार्गदर्शन का संक्षिप्त संकेत। यह कानूनी सलाह नहीं देता।'), duration: text('Guide', 'गाइड'), feePaise: null, mode: 'information' },
];

export const categoryOrder: ServiceCategory[] = ['licence', 'vehicle', 'compliance', 'industry', 'insights', 'guides'];

export function t(value: LocalText, locale: Locale): string {
  return value[locale];
}

export function getService(slug: string): TransportService | undefined {
  return services.find((service) => service.slug === slug);
}

export function servicesByCategory(category: ServiceCategory): TransportService[] {
  return services.filter((service) => service.category === category);
}

export function servicePath(locale: Locale, service: TransportService): string {
  return `/${locale}/services/${service.slug}`;
}

export const portalCopy = {
  en: {
    brand: 'Raahi', brandLine: 'A clearer way through transport services', prototype: 'Independent hackathon prototype—not an official government service',
    home: 'Home', allServices: 'All services', dashboard: 'My applications', signIn: 'Demo sign in', signOut: 'Sign out', search: 'Search services', searchPlaceholder: 'Try “renew licence” or “vehicle tax”', searchAction: 'Search', menu: 'Menu', close: 'Close',
    heroEyebrow: 'One independent citizen portal', heroTitle: 'Transport services, without the maze.', heroBody: 'Find the right task, understand every requirement, and complete a safe synthetic journey in one calm interface.', heroPrimary: 'Explore all services', heroSecondary: 'Try licence renewal', heroNote: 'No real IDs, OTPs, files, payments, or government systems.',
    popularEyebrow: 'Start with a common task', popularTitle: 'Popular citizen journeys', popularBody: 'Every item opens a working prototype or a clearly labelled information view.',
    indexEyebrow: 'Complete service directory', indexTitle: 'Everything in one readable index', viewCategory: 'View category', viewService: 'View service', servicesCount: 'services',
    renewalEyebrow: 'Showcase journey', renewalTitle: 'A complete renewal, from eligibility to receipt.', renewalBody: 'The deepest workflow saves progress, simulates document metadata and payment safely, and ends with a trackable synthetic application.', renewalCta: 'Start the full renewal demo',
    trustTitle: 'Built to demonstrate better public-service UX—never to imitate authority.', trustBody: 'Raahi uses original identity, synthetic records, visible mock labels, and local prototype routes. It does not connect to Parivahan or claim government endorsement.',
    footerExplore: 'Explore', footerSupport: 'Prototype help', footerAbout: 'About this build', footerLine: 'Built with Codex for Build What Moves India.',
    directoryEyebrow: 'Service directory', directoryTitle: 'Choose what you need to do', directoryBody: 'Search or browse by goal. Transaction demos use only synthetic records and visible demo codes.', noResults: 'No services match that search.', clear: 'Clear search',
    servicePrototype: 'Synthetic service prototype', requirements: 'Before you start', requirement1: 'Use only the prefilled fictional citizen and vehicle records.', requirement2: 'The visible demo OTP is 123456. No message is sent.', requirement3: 'Any fee is simulated; never enter card, bank, or UPI information.', expectedTime: 'Demo time', sampleFee: 'Sample fee', free: 'No demo fee', start: 'Start this demo', openDashboard: 'Open interactive overview', readGuide: 'Read this prototype guide',
    step1: 'Understand', step2: 'Choose', step3: 'Verify', step4: 'Receipt', howItWorks: 'How this prototype works', related: 'Related services', backServices: 'Back to all services',
  },
  hi: {
    brand: 'राही', brandLine: 'परिवहन सेवाओं के लिए एक स्पष्ट रास्ता', prototype: 'स्वतंत्र हैकाथॉन प्रोटोटाइप—यह आधिकारिक सरकारी सेवा नहीं है',
    home: 'होम', allServices: 'सभी सेवाएँ', dashboard: 'मेरे आवेदन', signIn: 'डेमो साइन इन', signOut: 'साइन आउट', search: 'सेवाएँ खोजें', searchPlaceholder: 'जैसे “लाइसेंस नवीनीकरण” या “वाहन कर”', searchAction: 'खोजें', menu: 'मेन्यू', close: 'बंद करें',
    heroEyebrow: 'एक स्वतंत्र नागरिक पोर्टल', heroTitle: 'परिवहन सेवाएँ, बिना उलझन।', heroBody: 'सही काम खोजें, हर आवश्यकता समझें और एक सरल इंटरफ़ेस में सुरक्षित काल्पनिक प्रक्रिया पूरी करें।', heroPrimary: 'सभी सेवाएँ देखें', heroSecondary: 'लाइसेंस नवीनीकरण आज़माएँ', heroNote: 'कोई वास्तविक ID, OTP, फ़ाइल, भुगतान या सरकारी सिस्टम नहीं।',
    popularEyebrow: 'सामान्य कार्य से शुरू करें', popularTitle: 'लोकप्रिय नागरिक प्रक्रियाएँ', popularBody: 'हर विकल्प काम करने वाला प्रोटोटाइप या स्पष्ट जानकारी दृश्य खोलता है।',
    indexEyebrow: 'पूर्ण सेवा निर्देशिका', indexTitle: 'सब कुछ एक पठनीय सूची में', viewCategory: 'श्रेणी देखें', viewService: 'सेवा देखें', servicesCount: 'सेवाएँ',
    renewalEyebrow: 'मुख्य प्रक्रिया', renewalTitle: 'पात्रता से रसीद तक पूर्ण नवीनीकरण।', renewalBody: 'सबसे विस्तृत प्रक्रिया प्रगति सहेजती है, दस्तावेज़ मेटाडेटा और भुगतान सुरक्षित रूप से सिम्युलेट करती है और ट्रैक करने योग्य काल्पनिक आवेदन देती है।', renewalCta: 'पूर्ण नवीनीकरण डेमो शुरू करें',
    trustTitle: 'बेहतर सार्वजनिक-सेवा UX दिखाने के लिए—अधिकार की नकल के लिए नहीं।', trustBody: 'राही मूल पहचान, काल्पनिक रिकॉर्ड, स्पष्ट मॉक लेबल और स्थानीय प्रोटोटाइप मार्ग उपयोग करता है। यह परिवहन सिस्टम से नहीं जुड़ता और सरकारी समर्थन का दावा नहीं करता।',
    footerExplore: 'देखें', footerSupport: 'प्रोटोटाइप सहायता', footerAbout: 'इस निर्माण के बारे में', footerLine: 'Build What Moves India के लिए Codex से बनाया गया।',
    directoryEyebrow: 'सेवा निर्देशिका', directoryTitle: 'अपना काम चुनें', directoryBody: 'लक्ष्य के अनुसार खोजें या ब्राउज़ करें। लेनदेन डेमो केवल काल्पनिक रिकॉर्ड और दिखाई देने वाले डेमो कोड उपयोग करते हैं।', noResults: 'इस खोज से कोई सेवा नहीं मिली।', clear: 'खोज हटाएँ',
    servicePrototype: 'काल्पनिक सेवा प्रोटोटाइप', requirements: 'शुरू करने से पहले', requirement1: 'केवल पहले से भरे काल्पनिक नागरिक और वाहन रिकॉर्ड उपयोग करें।', requirement2: 'दिखाई देने वाला डेमो OTP 123456 है। कोई संदेश नहीं भेजा जाता।', requirement3: 'हर शुल्क सिम्युलेटेड है; कार्ड, बैंक या UPI जानकारी न दें।', expectedTime: 'डेमो समय', sampleFee: 'नमूना शुल्क', free: 'कोई डेमो शुल्क नहीं', start: 'यह डेमो शुरू करें', openDashboard: 'इंटरैक्टिव विवरण खोलें', readGuide: 'यह प्रोटोटाइप गाइड पढ़ें',
    step1: 'समझें', step2: 'चुनें', step3: 'सत्यापित करें', step4: 'रसीद', howItWorks: 'यह प्रोटोटाइप कैसे काम करता है', related: 'संबंधित सेवाएँ', backServices: 'सभी सेवाओं पर वापस',
  },
} as const;

export type PortalCopy = (typeof portalCopy)[Locale];

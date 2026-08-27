import type { Metadata } from 'next';
import { Anek_Devanagari, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';

const anek = Anek_Devanagari({
  variable: '--font-anek',
  subsets: ['devanagari', 'latin'],
  weight: ['600', '700'],
});

const noto = Noto_Sans_Devanagari({
  variable: '--font-noto',
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: { default: 'Licence Renewal Guide', template: '%s · Licence Renewal Guide' },
  description: 'A bilingual, synthetic driving-licence renewal prototype for Build What Moves India.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${anek.variable} ${noto.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Anek_Devanagari, Fraunces, Geist, Noto_Sans_Devanagari } from 'next/font/google';
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

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  weight: ['500', '600'],
});

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: { default: 'Raahi · Transport services without the maze', template: '%s · Raahi' },
  description: 'A bilingual, independent transport-service prototype for Build What Moves India, using synthetic data only.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${geist.variable} ${anek.variable} ${noto.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

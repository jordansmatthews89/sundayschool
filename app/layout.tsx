import type { Metadata } from 'next';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { PromoBanner, SiteHeader, ValueBar } from '@/components/SiteHeader';
import { getPublicConfig } from '@/lib/public-config';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Family Faith — Kids Bible Studies & Family Resources',
  description: 'Newsletter, digital curriculum, and shop. One place for family faith.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { shopUrl } = await getPublicConfig();
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body className="font-sans antialiased">
        <PromoBanner />
        <SiteHeader shopUrl={shopUrl} />
        <ValueBar />
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}

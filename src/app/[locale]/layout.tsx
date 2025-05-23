
import type { Metadata, Viewport } from 'next';
import { Inter, Roboto } from 'next/font/google';
import '../globals.css'; 
import { Toaster } from "@/components/ui/toaster";
import { getDictionary, Dictionary } from '@/lib/translations'; 
import type { Locale } from '@/lib/i18n-config';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const dict: Dictionary = await getDictionary(locale);
  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
    icons: {
      icon: '/job-magnetic-icon.svg', // Path relative to public folder
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F5F5" }, 
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" }, 
  ],
}

export default async function LocaleLayout({ // Made this function async
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: Locale };
}>) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${roboto.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

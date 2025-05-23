
import type { Metadata, Viewport } from 'next';
import { Inter, Roboto } from 'next/font/google';
import '../globals.css';
import { Toaster } from "@/components/ui/toaster";
import { getDictionary, type Dictionary } from '@/lib/translations';
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

interface LayoutAndPageProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: LayoutAndPageProps): Promise<Metadata> {
  const { locale } = params; // Destructure locale from params
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
};

interface LocaleLayoutProps extends LayoutAndPageProps {
  children: React.ReactNode;
}

export default async function LocaleLayout({
  children,
  params, // Pass params as a whole object
}: LocaleLayoutProps) {
  const { locale } = params; // Destructure locale from params here
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${roboto.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

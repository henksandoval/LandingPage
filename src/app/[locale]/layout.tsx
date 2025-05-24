
import type { Metadata, Viewport } from 'next';
import { Inter, Roboto } from 'next/font/google';
import '../globals.css';
import { Toaster } from "@/components/ui/toaster";
import { getDictionary, type Dictionary } from '@/lib/translations';

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
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LayoutAndPageProps): Promise<Metadata> {
  const { locale } = await params; // Destructure locale from params
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

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = await params; // Destructure locale from params here
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${roboto.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

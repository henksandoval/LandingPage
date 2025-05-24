
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { getDictionary, type Dictionary } from '@/lib/translations';
import type { Locale } from '@/lib/i18n-config';
import { format } from 'date-fns';

interface LegalPageProps {
  params: { locale: Locale };
}

export default async function PrivacyPage({ params: { locale } }: LegalPageProps) {
  const t: Dictionary = await getDictionary(locale);
  const privacyData = t.privacyPage || {};
  const currentDate = format(new Date(), 'MMMM d, yyyy');
  const lastUpdated = privacyData.lastUpdated?.replace('{currentDate}', currentDate) || `Last Updated: ${currentDate}`;


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header locale={locale} tHeader={t.header} tThemeToggle={t.themeToggle} />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12 md:py-16">
        <article className="prose dark:prose-invert max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2 text-foreground">
            {privacyData.title || "Privacy Policy"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">{lastUpdated}</p>
          
          {privacyData.introduction?.map((paragraph: string, index: number) => (
            <p key={`intro-${index}`} className="text-muted-foreground">{paragraph}</p>
          ))}

          {privacyData.sections?.map((section: { title: string; content: string[] }, sectionIndex: number) => (
            <section key={`section-${sectionIndex}`} className="mt-8">
              <h2 className="text-2xl font-semibold font-heading mb-4 text-foreground">{section.title}</h2>
              {section.content?.map((paragraph: string, pIndex: number) => (
                <p key={`section-${sectionIndex}-p-${pIndex}`} className="text-muted-foreground">{paragraph}</p>
              ))}
            </section>
          ))}

          {privacyData.conclusion?.map((paragraph: string, index: number) => (
            <p key={`conclusion-${index}`} className="mt-6 text-muted-foreground">{paragraph}</p>
          ))}
        </article>
      </main>
      <Footer t={t.footer} />
    </div>
  );
}

export async function generateMetadata({ params: { locale } }: LegalPageProps) {
  const t: Dictionary = await getDictionary(locale);
  const privacyData = t.privacyPage || {};
  return {
    title: privacyData.title || "Privacy Policy",
    description: privacyData.metaDescription || "Read our Privacy Policy for Job Magnetic.",
  };
}

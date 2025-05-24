
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { getDictionary, type Dictionary } from '@/lib/translations';
import type { Locale } from '@/lib/i18n-config';
import { format } from 'date-fns';

interface LegalPageProps {
  params: { locale: string }; // Keep as string for broader compatibility
}

export default async function TermsPage({ params }: LegalPageProps) {
  const { locale } = params; // No need to await here
  const localeString = locale as Locale;
  const t: Dictionary = await getDictionary(localeString);
  const termsData = t.termsPage || {};
  const currentDate = format(new Date(), 'MMMM d, yyyy');
  const lastUpdated = termsData.lastUpdated?.replace('{currentDate}', currentDate) || `Last Updated: ${currentDate}`;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header locale={localeString} tHeader={t.header} tThemeToggle={t.themeToggle} />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12 md:py-16">
        <article className="prose dark:prose-invert max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2 text-foreground">
            {termsData.title || "Terms of Service"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">{lastUpdated}</p>
          
          {termsData.introduction?.map((paragraph: string, index: number) => (
            <p key={`intro-${index}`} className="text-muted-foreground">{paragraph}</p>
          ))}

          {termsData.sections?.map((section: { title: string; content: string[] }, sectionIndex: number) => (
            <section key={`section-${sectionIndex}`} className="mt-8">
              <h2 className="text-2xl font-semibold font-heading mb-4 text-foreground">{section.title}</h2>
              {section.content?.map((paragraph: string, pIndex: number) => (
                <p key={`section-${sectionIndex}-p-${pIndex}`} className="text-muted-foreground">{paragraph}</p>
              ))}
            </section>
          ))}

          {termsData.conclusion?.map((paragraph: string, index: number) => (
            <p key={`conclusion-${index}`} className="mt-6 text-muted-foreground">{paragraph}</p>
          ))}
        </article>
      </main>
      <Footer t={t.footer} />
    </div>
  );
}

export async function generateMetadata({ params }: LegalPageProps) {
  const { locale } = params; // No need to await here for simple param access
  const t: Dictionary = await getDictionary(locale as Locale);
  const termsData = t.termsPage || {};
  return {
    title: termsData.title || "Terms of Service",
    description: termsData.metaDescription || "Read our Terms of Service for Job Magnetic.",
  };
}

    
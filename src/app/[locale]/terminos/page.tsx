
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { getDictionary, type Dictionary } from '@/lib/translations';
import type { Locale } from '@/lib/i18n-config';

interface LegalPageProps {
  params: {
    locale: Locale;
  };
}

export default async function TerminosPage({ params: { locale } }: LegalPageProps) {
  const t: Dictionary = await getDictionary(locale);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header locale={locale} tHeader={t.header} tThemeToggle={t.themeToggle} />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12 md:py-16">
        <article className="prose dark:prose-invert max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-6 text-foreground">
            {t.termsPage?.title || "Terms of Service"}
          </h1>
          <div className="space-y-4 text-muted-foreground">
            <p>{t.termsPage?.content || "Placeholder content for Terms of Service."}</p>
            {/* Add more paragraphs or sections as needed */}
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <h2 className="text-2xl font-semibold font-heading mt-8 mb-4 text-foreground">{t.termsPage?.section1Title || "Section 1: Introduction"}</h2>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            <h2 className="text-2xl font-semibold font-heading mt-8 mb-4 text-foreground">{t.termsPage?.section2Title || "Section 2: User Responsibilities"}</h2>
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
          </div>
        </article>
      </main>
      <Footer t={t.footer} />
    </div>
  );
}

// Add metadata generation if needed
export async function generateMetadata({ params: { locale } }: LegalPageProps) {
  const t: Dictionary = await getDictionary(locale);
  return {
    title: t.termsPage?.title || "Terms of Service",
    description: t.termsPage?.metaDescription || "Read our Terms of Service.",
  };
}

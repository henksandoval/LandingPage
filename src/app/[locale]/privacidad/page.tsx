
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { getDictionary, type Dictionary } from '@/lib/translations';
import type { Locale } from '@/lib/i18n-config';

interface LegalPageProps {
  params: {
    locale: Locale;
  };
}

export default async function PrivacidadPage({ params: { locale } }: LegalPageProps) {
  const t: Dictionary = await getDictionary(locale);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header locale={locale} tHeader={t.header} tThemeToggle={t.themeToggle} />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12 md:py-16">
        <article className="prose dark:prose-invert max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-6 text-foreground">
            {t.privacyPage?.title || "Privacy Policy"}
          </h1>
          <div className="space-y-4 text-muted-foreground">
            <p>{t.privacyPage?.content || "Placeholder content for Privacy Policy."}</p>
            {/* Add more paragraphs or sections as needed */}
            <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
            <p>Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.</p>
            <h2 className="text-2xl font-semibold font-heading mt-8 mb-4 text-foreground">{t.privacyPage?.section1Title || "Section 1: Information We Collect"}</h2>
            <p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p>
             <h2 className="text-2xl font-semibold font-heading mt-8 mb-4 text-foreground">{t.privacyPage?.section2Title || "Section 2: How We Use Your Information"}</h2>
            <p>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.</p>
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
    title: t.privacyPage?.title || "Privacy Policy",
    description: t.privacyPage?.metaDescription || "Read our Privacy Policy.",
  };
}

import { Dictionary } from '@/lib/translations';

interface FooterProps {
  t: Dictionary; // Or a more specific type for footer translations
}
export function Footer({ t }: FooterProps) {
  const year = new Date().getFullYear();
  const copyrightText = t.copyright?.replace('{year}', year.toString()) || `© ${year} Job Magnetic. All rights reserved.`;
  
  return (
    <footer className="py-8 border-t border-border bg-muted/50">
      <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground">
        <p className="text-sm">{copyrightText}</p>
      </div>
    </footer>
  );
}

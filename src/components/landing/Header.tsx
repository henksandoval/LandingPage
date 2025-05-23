
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, Languages } from 'lucide-react'; // Added Languages icon
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ThemeToggleButton } from './ThemeToggleButton';
import type { Dictionary } from '@/lib/translations';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n-config';
import { i18n } from '@/lib/i18n-config'; // Import i18n config

interface HeaderProps {
  locale: Locale;
  tHeader: Dictionary;
  tThemeToggle: Dictionary;
}

// New Language Switcher Dropdown component
function LanguageSwitcherDropdown({ currentLocale, tHeader }: { currentLocale: Locale; tHeader: Dictionary }) {
  const pathname = usePathname();
  const { locales } = i18n;

  const getLocalizedPath = (targetLocale: string) => {
    if (!pathname) return `/${targetLocale}`;
    const segments = pathname.split('/');
    segments[1] = targetLocale; // Assumes locale is always the first segment after /
    return segments.join('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="ml-2">
          <Languages className="h-5 w-5" />
          <span className="sr-only">{tHeader.languageSelectorTooltip || "Change language"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem key={loc} asChild className={currentLocale === loc ? "bg-accent font-semibold" : ""}>
            <Link href={getLocalizedPath(loc)}>
              {loc.toUpperCase()}
              {currentLocale === loc && <span className="ml-2 text-xs text-muted-foreground">({tHeader.currentLanguage || "Current"})</span>}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header({ locale, tHeader, tThemeToggle }: HeaderProps) {
  return (
    <header className="py-6 sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link href={`/${locale}/`} className="text-2xl md:text-3xl font-bold font-heading text-primary hover:opacity-80 transition-opacity">
          {tHeader.appName}
        </Link>
        <nav className="hidden md:flex gap-4 items-center">
          <Link href={`/${locale}/#como-funciona`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            {tHeader.nav.howItWorks}
          </Link>
          <Link href={`/${locale}/#beneficios`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            {tHeader.nav.benefits}
          </Link>
          <Link href={`/${locale}/#testimonios`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            {tHeader.nav.testimonials}
          </Link>
           <Link href={`/${locale}/#upload-cv`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            {tHeader.nav.uploadCv}
          </Link>
          <Button asChild size="sm">
            <Link href={`/${locale}/#cta`}>{tHeader.nav.joinNow}</Link>
          </Button>
          <ThemeToggleButton translations={tThemeToggle} />
          <LanguageSwitcherDropdown currentLocale={locale} tHeader={tHeader} />
        </nav>
        <div className="md:hidden flex items-center">
          <ThemeToggleButton translations={tThemeToggle} />
          <LanguageSwitcherDropdown currentLocale={locale} tHeader={tHeader} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="ml-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">{tHeader.mobileMenuTitle || "Open menu"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/#como-funciona`}>{tHeader.nav.howItWorks}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/#beneficios`}>{tHeader.nav.benefits}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/#testimonios`}>{tHeader.nav.testimonials}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/#upload-cv`}>{tHeader.nav.uploadCv}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/#cta`}>{tHeader.nav.joinNow}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

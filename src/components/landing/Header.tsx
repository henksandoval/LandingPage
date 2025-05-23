"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ThemeToggleButton } from './ThemeToggleButton';
import { Dictionary } from '@/lib/translations';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n-config';

interface HeaderProps {
  locale: Locale;
  tHeader: Dictionary; 
  tThemeToggle: Dictionary;
}

function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();

  const getLocalizedPath = (targetLocale: string) => {
    if (!pathname) return `/${targetLocale}`;
    const segments = pathname.split('/');
    segments[1] = targetLocale;
    return segments.join('/');
  };

  return (
    <div className="flex items-center gap-2 ml-2">
      {(['es', 'en'] as Locale[]).map((loc) => (
        <Button key={loc} variant={currentLocale === loc ? "default" : "ghost"} size="sm" asChild>
          <Link
            href={getLocalizedPath(loc)}
            className={`text-xs font-medium ${
              currentLocale === loc ? "text-primary-foreground" : "text-muted-foreground hover:text-primary"
            }`}
          >
            {loc.toUpperCase()}
          </Link>
        </Button>
      ))}
    </div>
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
          <LanguageSwitcher currentLocale={locale} />
        </nav>
        <div className="md:hidden flex items-center">
          <ThemeToggleButton translations={tThemeToggle} />
          <LanguageSwitcher currentLocale={locale} />
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

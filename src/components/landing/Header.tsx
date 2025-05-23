
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, Languages, Settings, Sun, Moon } from 'lucide-react'; // Added Settings, Sun, Moon
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { ThemeToggleButton } from './ThemeToggleButton';
import type { Dictionary } from '@/lib/translations';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n-config';
import { i18n } from '@/lib/i18n-config';
import * as React from 'react';

interface HeaderProps {
  locale: Locale;
  tHeader: Dictionary;
  tThemeToggle: Dictionary;
}

export function Header({ locale, tHeader, tThemeToggle }: HeaderProps) {
  const pathname = usePathname();
  const { locales, defaultLocale } = i18n;

  const getLocalizedPath = (targetLocale: string) => {
    if (!pathname) return `/${targetLocale}`;
    const segments = pathname.split('/');
    segments[1] = targetLocale; // Assumes locale is always the first segment after /
    return segments.join('/');
  };

  // Logic from ThemeToggleButton to display current theme status in menu (optional)
  // This is simplified; ThemeToggleButton itself handles the actual toggling.
  const [mounted, setMounted] = React.useState(false);
  const [currentTheme, setCurrentTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme") as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (storedTheme) {
      setCurrentTheme(storedTheme);
    } else if (systemPrefersDark) {
      setCurrentTheme("dark");
    } else {
      setCurrentTheme("light");
    }
     // Listen for custom event if ThemeToggleButton dispatches one, or re-check localStorage
    const handleThemeChange = () => {
      const newStoredTheme = localStorage.getItem("theme") as 'light' | 'dark' | null;
      if (newStoredTheme) setCurrentTheme(newStoredTheme);
    };
    window.addEventListener('themeChanged', handleThemeChange); // Assuming ThemeToggleButton might dispatch such an event
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);


  const settingsMenuContent = (
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>{tHeader.settingsDropdownTitle || "Settings"}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Languages className="mr-2 h-4 w-4" />
          <span>{tHeader.languageDropdownLabel || "Language"}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          {locales.map((loc) => (
            <DropdownMenuItem key={loc} asChild className={locale === loc ? "bg-accent font-semibold" : ""}>
              <Link href={getLocalizedPath(loc)}>
                {loc.toUpperCase()}
                {locale === loc && <span className="ml-2 text-xs text-muted-foreground">({tHeader.currentLanguage || "Current"})</span>}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          {currentTheme === 'light' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
          <span>{tHeader.themeDropdownLabel || "Theme"}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <ThemeToggleButton translations={tThemeToggle} />
        </DropdownMenuSubContent>
      </DropdownMenuSub>

    </DropdownMenuContent>
  );

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="ml-2">
                <Settings className="h-5 w-5" />
                <span className="sr-only">{tHeader.settingsDropdownTitle || "Open settings"}</span>
              </Button>
            </DropdownMenuTrigger>
            {settingsMenuContent}
          </DropdownMenu>
        </nav>
        <div className="md:hidden flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="ml-2">
                <Settings className="h-5 w-5" />
                <span className="sr-only">{tHeader.settingsDropdownTitle || "Open settings"}</span>
              </Button>
            </DropdownMenuTrigger>
            {settingsMenuContent}
          </DropdownMenu>
          
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

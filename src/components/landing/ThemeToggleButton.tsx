
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from '@/lib/translations'; // Ensure Dictionary type is correctly imported/defined
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface ThemeToggleButtonProps {
  translations: Dictionary; // This will be t.themeToggle from parent
  asMenuItem?: boolean; 
}

export function ThemeToggleButton({ translations: t, asMenuItem = false }: ThemeToggleButtonProps) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme") as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (storedTheme) {
      setTheme(storedTheme);
    } else if (systemPrefersDark) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  React.useEffect(() => {
    if (mounted) {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      // Dispatch a custom event to notify other components of theme change
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  if (!mounted && !asMenuItem) {
    // Default to Sun icon before hydration for button variant
    return <Button variant="outline" size="icon" disabled className="w-9 h-9"><Sun className="h-[1.2rem] w-[1.2rem]" /></Button>;
  }
  if (!mounted && asMenuItem) {
     return (
      <DropdownMenuItem disabled>
        <Sun className="mr-2 h-4 w-4" />
        <span>{t.activateDarkMode || "Activate dark mode"}</span>
      </DropdownMenuItem>
    );
  }

  const content = (
    <>
      {theme === 'light' ? (
        <Sun className="mr-2 h-4 w-4" />
      ) : (
        <Moon className="mr-2 h-4 w-4" />
      )}
      <span>
        {theme === "light" ? (t.activateDarkMode || "Activate dark mode") : (t.activateLightMode || "Activate light mode")}
      </span>
    </>
  );

  if (asMenuItem) {
    return (
      <DropdownMenuItem onClick={toggleTheme}>
        {content}
      </DropdownMenuItem>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === "light" ? (t.activateDarkMode || "Activate dark mode") : (t.activateLightMode || "Activate light mode")}
      className="w-9 h-9"
    >
      {theme === 'light' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      )}
      <span className="sr-only">{t.toggleTheme || "Toggle theme"}</span>
    </Button>
  );
}

    
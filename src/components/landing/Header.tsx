import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="py-6 sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl md:text-3xl font-bold font-heading text-primary hover:opacity-80 transition-opacity">
          Job Magnetic
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Cómo Funciona
          </Link>
          <Link href="/#beneficios" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Beneficios
          </Link>
          <Button asChild size="sm">
            <Link href="/#cta">Únete Ahora</Link>
          </Button>
        </nav>
        <div className="md:hidden">
          {/* TODO: Mobile menu button can be added here */}
          <Button asChild size="sm">
            <Link href="/#cta">Únete</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

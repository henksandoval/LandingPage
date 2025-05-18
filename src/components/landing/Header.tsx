import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


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
          <Link href="/#testimonios" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Testimonios
          </Link>
          <Button asChild size="sm">
            <Link href="/#cta">Únete Ahora</Link>
          </Button>
        </nav>
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/#como-funciona">Cómo Funciona</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/#beneficios">Beneficios</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/#testimonios">Testimonios</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/#cta">Únete Ahora</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

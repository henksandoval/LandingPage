import Link from 'next/link';

export function Header() {
  return (
    <header className="py-6 sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl md:text-3xl font-bold font-heading text-primary hover:opacity-80 transition-opacity">
          Job Magnetic
        </Link>
        {/* <Button variant="outline" size="sm">Únete ahora</Button> */}
      </div>
    </header>
  );
}

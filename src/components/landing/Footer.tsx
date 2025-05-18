export function Footer() {
  return (
    <footer className="py-8 border-t border-border bg-muted/50">
      <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground">
        <p className="text-sm">&copy; {new Date().getFullYear()} Job Magnetic. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

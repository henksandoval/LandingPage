
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

export function CvUploadSection() {
  // Placeholder para la lógica de carga de archivo
  const handleCvUpload = () => {
    // Aquí iría la lógica para abrir el selector de archivos o manejar el drag & drop
    alert("Funcionalidad de carga de CV en desarrollo. ¡Gracias por tu interés!");
  };

  return (
    <section id="upload-cv" className="py-16 md:py-24 bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="max-w-3xl mx-auto text-center shadow-2xl border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 transform hover:scale-[1.01]">
          <CardHeader className="pb-4">
            <div className="mx-auto bg-primary/10 p-5 rounded-full w-fit mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className="h-16 w-16 text-primary" strokeWidth={1.5} />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold font-heading mb-3 text-foreground">
              Impulsa tu Futuro: <span className="text-primary">Carga tu CV Ahora</span>
            </CardTitle>
            <CardDescription className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
              Nuestra <span className="font-semibold text-primary">inteligencia artificial</span> analizará tu experiencia y creará un perfil profesional <span className="font-semibold text-accent">dinámico y optimizado</span> en minutos. ¡El primer paso hacia nuevas oportunidades está a un clic!
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-8 px-6 md:px-10">
            <div 
              className="mt-6 mb-8 border-2 border-dashed border-muted-foreground/40 rounded-xl p-8 md:p-12 hover:border-primary/70 transition-colors duration-300 cursor-pointer bg-muted/10 hover:bg-primary/5 group"
              onClick={handleCvUpload}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleCvUpload()}
              aria-label="Zona para arrastrar y soltar o seleccionar archivo de CV"
            >
              <UploadCloud className="h-12 w-12 text-muted-foreground/70 mx-auto mb-4 group-hover:text-primary transition-colors duration-300" />
              <p className="text-muted-foreground font-medium text-lg">
                Arrastra y suelta tu archivo aquí
              </p>
              <p className="text-muted-foreground/80">o haz clic para seleccionar</p>
              <p className="text-xs text-muted-foreground/60 mt-3">
                (Formatos: PDF, DOCX - Máx. 5MB)
              </p>
            </div>
            <Button 
              size="lg" 
              className="py-7 px-10 text-lg rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-full md:w-auto"
              onClick={handleCvUpload}
            >
              <UploadCloud className="mr-3 h-6 w-6" />
              Seleccionar CV y Crear Perfil
            </Button>
            <p className="mt-8 text-xs text-muted-foreground/80">
              Al subir tu CV, aceptas nuestros <Link href="/terminos" className="underline hover:text-primary">Términos de Servicio</Link> y <Link href="/privacidad" className="underline hover:text-primary">Política de Privacidad</Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// Necesitas importar Link de next/link si no está ya
import Link from 'next/link';

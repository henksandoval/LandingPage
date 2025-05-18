import Image from 'next/image';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { SubscriptionForm } from '@/components/landing/SubscriptionForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Eye, FileText, Globe, Rocket, Sparkles, ThumbsUp, UploadCloud, Zap, Briefcase, Users } from 'lucide-react';
import Link from 'next/link';

const benefits = [
  {
    icon: <Sparkles className="h-8 w-8 text-primary mb-4" />,
    title: "Sitio Web Profesional al Instante",
    description: "Convierte tu CV en un micrositio atractivo y moderno en cuestión de minutos.",
  },
  {
    icon: <Eye className="h-8 w-8 text-primary mb-4" />,
    title: "Aumenta tu Visibilidad",
    description: "Destaca entre la multitud y llega a reclutadores que buscan tu perfil único.",
  },
  {
    icon: <Zap className="h-8 w-8 text-primary mb-4" />,
    title: "Nuevas Oportunidades",
    description: "Conéctate con ofertas laborales relevantes sin esfuerzo adicional.",
  },
  {
    icon: <ThumbsUp className="h-8 w-8 text-primary mb-4" />,
    title: "Fácil de Usar",
    description: "Una interfaz intuitiva diseñada para que te enfoques en lo importante: tu carrera.",
  },
];

const howItWorksSteps = [
  {
    icon: <UploadCloud className="h-10 w-10 text-primary" />,
    title: "1. Sube tu CV",
    description: "Arrastra o selecciona tu currículum actual. Nosotros nos encargamos del resto.",
    imageHint: "cv upload document"
  },
  {
    icon: <Globe className="h-10 w-10 text-primary" />,
    title: "2. Magia Automática",
    description: "Nuestra IA transforma tu información en un CV-Viewer público, elegante y profesional.",
    imageHint: "website preview portfolio"
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: "3. Conecta y Crece",
    description: "Tu nuevo sitio te abrirá puertas a oportunidades laborales que se ajustan a ti.",
    imageHint: "networking connection job"
  },
];


export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-secondary via-background to-background">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 text-foreground leading-tight">
              ¡Transforma tu CV en un <span className="text-primary">Sitio Web Público</span> en Minutos!
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Job Magnetic te conecta con nuevas oportunidades laborales mientras tú te enfocas en lo que mejor sabes hacer.
            </p>
            <div className="flex justify-center">
              <SubscriptionForm buttonText="Únete y sé un early adopter 🚀" />
            </div>
            <div className="mt-16">
              <Image
                src="https://placehold.co/1200x600.png"
                alt="Job Magnetic CV Viewer example"
                width={1200}
                height={600}
                className="rounded-xl shadow-2xl mx-auto"
                data-ai-hint="cv website professional mockup"
                priority
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="como-funciona" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-center mb-4">
              Cómo Funciona <span className="text-primary">Job Magnetic</span>
            </h2>
            <p className="text-center text-muted-foreground mb-12 md:mb-16 max-w-2xl mx-auto">
              En solo tres simples pasos, estarás listo para impresionar a reclutadores y descubrir nuevas oportunidades.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorksSteps.map((step, index) => (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                      {step.icon}
                    </div>
                    <CardTitle className="font-heading text-2xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                    <Image 
                      src={`https://placehold.co/400x300.png`} 
                      alt={step.title}
                      width={400}
                      height={300}
                      className="mt-6 rounded-md mx-auto"
                      data-ai-hint={step.imageHint}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Key Benefits Section */}
        <section id="beneficios" className="py-16 md:py-24 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-center mb-12 md:mb-16">
              Beneficios Clave de <span className="text-primary">Job Magnetic</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
                  {benefit.icon}
                  <h3 className="text-xl font-semibold font-heading mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="cta" className="py-20 md:py-32 bg-gradient-to-br from-primary to-accent">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-primary-foreground">
              ¿Listo para Potenciar tu Carrera?
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
              Únete a nuestra comunidad de early adopters y sé el primero en experimentar la revolución de la búsqueda de empleo con Job Magnetic.
            </p>
            <div className="flex justify-center">
               <SubscriptionForm 
                 buttonText="¡Quiero ser Early Adopter! 🚀" 
                 placeholderText="Tu mejor correo electrónico"
               />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


import Image from 'next/image';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { SubscriptionForm } from '@/components/landing/SubscriptionForm';
import { CvUploadSection } from '@/components/landing/CvUploadSection'; // Importar el nuevo componente
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Sparkles, ThumbsUp, Briefcase, Users, Star, Wand2, FileText, UploadCloud } from 'lucide-react'; // Añadido FileText y UploadCloud
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
    icon: <Users className="h-8 w-8 text-primary mb-4" />,
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
    icon: <FileText className="h-10 w-10 text-primary" />, // Icono actualizado
    title: "1. Tu CV, la Base de Todo", // Título actualizado
    description: "Proporciona tu CV y nuestra IA extraerá la información clave para construir tu perfil único.", // Descripción actualizada
    imageHint: "cv data extraction process" // Hint actualizado
  },
  {
    icon: <Wand2 className="h-10 w-10 text-primary" />,
    title: "2. Magia Automática",
    description: "Nuestra IA transforma tu información en un perfil profesional público, elegante y optimizado.",
    imageHint: "ai transforming cv website mockup"
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: "3. Conecta y Crece",
    description: "Tu nuevo sitio te abrirá puertas a oportunidades laborales que se ajustan a ti.",
    imageHint: "professional networking job connections"
  },
];

const testimonials = [
  {
    name: "Ana Pérez",
    role: "Diseñadora UX/UI",
    quote: "¡Job Magnetic transformó mi búsqueda de empleo! En minutos tenía un perfil profesional online que realmente destaca. ¡Ya he recibido dos ofertas!",
    avatar: "https://placehold.co/100x100.png",
    avatarFallback: "AP",
    rating: 5,
    imageHint: "woman professional"
  },
  {
    name: "Carlos López",
    role: "Desarrollador Full-Stack",
    quote: "Estaba cansado de enviar CVs genéricos. Con Job Magnetic, mi perfil tiene personalidad y es mucho más fácil para los reclutadores ver mi potencial.",
    avatar: "https://placehold.co/100x100.png",
    avatarFallback: "CL",
    rating: 5,
    imageHint: "man smiling"
  },
  {
    name: "Sofía Rodríguez",
    role: "Especialista en Marketing Digital",
    quote: "La simplicidad y rapidez para crear un sitio profesional es increíble. Definitivamente una herramienta que recomiendo a todos mis colegas.",
    avatar: "https://placehold.co/100x100.png",
    avatarFallback: "SR",
    rating: 4,
    imageHint: "woman working"
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
              ¡Transforma tu CV en un <span className="text-primary">Perfil Profesional Público</span> en Minutos!
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Job Magnetic te conecta con nuevas oportunidades laborales mientras tú te enfocas en lo que mejor sabes hacer.
            </p>
            <div className="flex justify-center">
              <SubscriptionForm 
                buttonText="Ser Notificado del Lanzamiento 🚀"  // Texto del botón actualizado
                placeholderText="Tu correo para acceso prioritario" // Placeholder actualizado
              />
            </div>
            <div className="mt-16">
              <Image
                src="https://placehold.co/1200x600.png"
                alt="Ejemplo de perfil profesional público creado con Job Magnetic"
                width={1200}
                height={600}
                className="rounded-xl shadow-2xl mx-auto"
                data-ai-hint="cv website professional mockup"
                priority
              />
            </div>
          </div>
        </section>

        {/* CV Upload Section - NUEVA SECCIÓN */}
        <CvUploadSection />

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
                <Card 
                  key={index} 
                  className="text-center shadow-lg hover:shadow-xl dark:hover:shadow-dark-accent-glow-md hover:border-primary/30 transform hover:scale-[1.01] transition-all duration-300 ease-out bg-card flex flex-col"
                >
                  <CardHeader className="items-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                      {step.icon}
                    </div>
                    <CardTitle className="font-heading text-2xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <p className="text-muted-foreground mb-6">{step.description}</p>
                    <Image 
                      src={`https://placehold.co/400x300.png`} 
                      alt={step.title}
                      width={400}
                      height={300}
                      className="mt-auto rounded-md mx-auto"
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
                <Card 
                  key={index} 
                  className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl dark:hover:shadow-dark-accent-glow-md hover:border-primary/30 transform hover:scale-[1.01] transition-all duration-300 ease-out bg-card"
                >
                  {benefit.icon}
                  <h3 className="text-xl font-semibold font-heading mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonios" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-center mb-4">
              Lo que dicen <span className="text-primary">nuestros usuarios</span>
            </h2>
            <p className="text-center text-muted-foreground mb-12 md:mb-16 max-w-2xl mx-auto">
              Descubre cómo Job Magnetic está ayudando a profesionales como tú a alcanzar sus metas.
            </p>
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card 
                  key={index} 
                  className="flex flex-col bg-card shadow-lg hover:shadow-xl dark:hover:shadow-dark-accent-glow-md hover:border-primary/30 transform hover:scale-[1.01] transition-all duration-300 ease-out"
                >
                  <CardContent className="pt-6 flex-grow flex flex-col">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.imageHint} />
                        <AvatarFallback>{testimonial.avatarFallback}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg font-heading">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </div>
                    </div>
                    <blockquote className="text-muted-foreground italic border-l-4 border-primary pl-4 mb-4 flex-grow">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'
                          }`}
                        />
                      ))}
                    </div>
                  </CardContent>
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


import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { SubscriptionForm } from '@/components/landing/SubscriptionForm';
import { CvUploadSection } from '@/components/landing/CvUploadSection';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Sparkles, ThumbsUp, Briefcase, Users, Star, Wand2, FileText, ExternalLink } from 'lucide-react';
import { getDictionary, type Dictionary } from '@/lib/translations';
import type { Locale } from '@/lib/i18n-config';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params: params }: HomePageProps) {
  const { locale } = await params;
  const localeString = locale as Locale;
  const t: Dictionary = await getDictionary(localeString);

  const benefits = [
    {
      icon: <Sparkles className="h-8 w-8 text-primary mb-4" />,
      title: t.benefits.benefit1.title,
      description: t.benefits.benefit1.description,
    },
    {
      icon: <Eye className="h-8 w-8 text-primary mb-4" />,
      title: t.benefits.benefit2.title,
      description: t.benefits.benefit2.description,
    },
    {
      icon: <Users className="h-8 w-8 text-primary mb-4" />,
      title: t.benefits.benefit3.title,
      description: t.benefits.benefit3.description,
    },
    {
      icon: <ThumbsUp className="h-8 w-8 text-primary mb-4" />,
      title: t.benefits.benefit4.title,
      description: t.benefits.benefit4.description,
    },
  ];

  const howItWorksSteps = [
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: t.howItWorks.step1.title,
      description: t.howItWorks.step1.description,
      imageHint: "cv data extraction"
    },
    {
      icon: <Wand2 className="h-10 w-10 text-primary" />,
      title: t.howItWorks.step2.title,
      description: t.howItWorks.step2.description,
      demoLinkText: t.howItWorks.step2.demoLinkText,
      imageHint: "ai transforming cv"
    },
    {
      icon: <Briefcase className="h-10 w-10 text-primary" />,
      title: t.howItWorks.step3.title,
      description: t.howItWorks.step3.description,
      imageHint: "networking connections"
    },
  ];

  const testimonials = [
    {
      name: t.testimonials.user1.name,
      role: t.testimonials.user1.role,
      quote: t.testimonials.user1.quote,
      avatar: "https://placehold.co/100x100.png",
      avatarFallback: t.testimonials.user1.name.substring(0,1) + (t.testimonials.user1.name.split(' ')[1]?.substring(0,1) || t.testimonials.user1.name.substring(1,2)),
      rating: 5,
      imageHint: "woman professional"
    },
    {
      name: t.testimonials.user2.name,
      role: t.testimonials.user2.role,
      quote: t.testimonials.user2.quote,
      avatar: "https://placehold.co/100x100.png",
      avatarFallback: t.testimonials.user2.name.substring(0,1) + (t.testimonials.user2.name.split(' ')[1]?.substring(0,1) || t.testimonials.user2.name.substring(1,2)),
      rating: 5,
      imageHint: "man smiling"
    },
    {
      name: t.testimonials.user3.name,
      role: t.testimonials.user3.role,
      quote: t.testimonials.user3.quote,
      avatar: "https://placehold.co/100x100.png",
      avatarFallback: t.testimonials.user3.name.substring(0,1) + (t.testimonials.user3.name.split(' ')[1]?.substring(0,1) || t.testimonials.user3.name.substring(1,2)),
      rating: 4,
      imageHint: "woman working"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header locale={localeString} tHeader={t.header} tThemeToggle={t.themeToggle} />
      <main className="flex-grow">
        {/* Main Page Title and Description */}
        <section className="pt-12 md:pt-16 pb-6 md:pb-8 text-center">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-foreground">
              {t.hero.titlePart1}
              <span className="text-primary">{t.hero.titleHighlight}</span>
              {t.hero.titlePart2}
            </h1>
            <p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
              dangerouslySetInnerHTML={{ __html: t.cvUpload.description }}
            />
          </div>
        </section>

        {/* CV Upload Section - Now the first interactive section */}
        <CvUploadSection translations={t.cvUpload} locale={localeString} />

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-center mb-4"
                dangerouslySetInnerHTML={{ __html: t.howItWorks.sectionTitle }} />
            <p className="text-center text-muted-foreground mb-12 md:mb-16 max-w-2xl mx-auto">
              {t.howItWorks.sectionDescription}
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
                    <div>
                      <p className="text-muted-foreground mb-4">{step.description}</p>
                      {step.demoLinkText && index === 1 && (
                        <div className="mb-6 text-center">
                          <Link href={`/${localeString}/sample-profile`} className="text-primary hover:text-primary/80 font-medium inline-flex items-center">
                            {step.demoLinkText}
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </div>
                      )}
                    </div>
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
        <section id="benefits" className="py-16 md:py-24 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-center mb-12 md:mb-16"
                dangerouslySetInnerHTML={{ __html: t.benefits.sectionTitle }} />
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
        <section id="testimonials" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-center mb-4"
                dangerouslySetInnerHTML={{ __html: t.testimonials.sectionTitle }} />
            <p className="text-center text-muted-foreground mb-12 md:mb-16 max-w-2xl mx-auto">
              {t.testimonials.sectionDescription}
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
              {t.cta.title}
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
              {t.cta.description}
            </p>
            <div className="flex justify-center">
               <SubscriptionForm 
                 buttonText={t.cta.button} 
                 placeholderText={t.cta.placeholder}
                 translations={t.subscriptionForm}
               />
            </div>
             <div className="mt-8">
                <Link href={`/${localeString}/sample-profile`} passHref>
                  <Button 
                    variant="outline" 
                    className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  >
                    {t.hero.sampleProfileButtonText}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
          </div>
        </section>
      </main>
      <Footer t={t.footer} />
    </div>
  );
}

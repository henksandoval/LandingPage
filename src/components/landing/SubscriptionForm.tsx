
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Rocket, Loader2 } from "lucide-react";
import { useState } from "react";

const subscriptionSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un correo electrónico válido." }),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
  buttonText?: string;
  placeholderText?: string;
}

export function SubscriptionForm({ 
  buttonText = "Únete a nuestra lista de early adopters", 
  placeholderText = "tu@email.com" 
}: SubscriptionFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: SubscriptionFormValues) {
    setIsLoading(true);
    
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBaseUrl) {
      console.error("Error: NEXT_PUBLIC_API_BASE_URL no está configurada.");
      toast({
        title: "Error de Configuración",
        description: "La URL de la API no está configurada correctamente. Contacta al administrador.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const endpoint = `${apiBaseUrl.replace(/\/$/, '')}/user/earlyaccesor`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (response.ok) {
        // const responseData = await response.json(); // Opcional, si tu API devuelve datos
        toast({
          title: "¡Suscripción exitosa!",
          description: "Gracias por unirte. Te mantendremos informado.",
          variant: "default",
        });
        form.reset();
      } else {
        // const errorData = await response.json(); // Opcional, si tu API devuelve un error específico
        toast({
          title: "Error en la suscripción",
          description: `Hubo un problema al procesar tu solicitud (Estado: ${response.status}). Inténtalo de nuevo.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error en la llamada a la API:", error);
      toast({
        title: "Error de Red",
        description: "No se pudo conectar con el servidor. Verifica tu conexión o inténtalo más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder={placeholderText} 
                    {...field} 
                    className="pl-10 py-6 text-base rounded-lg shadow-sm focus:ring-primary focus:border-primary" 
                    aria-label="Correo electrónico"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full py-6 text-base rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          disabled={isLoading}
          aria-label={buttonText}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Rocket className="mr-2 h-5 w-5" />
          )}
          {buttonText}
        </Button>
      </form>
    </Form>
  );
}

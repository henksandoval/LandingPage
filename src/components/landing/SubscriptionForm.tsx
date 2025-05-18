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
    console.log("Subscribing email:", data.email);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    // Example:
    // const success = Math.random() > 0.2; // Simulate success/failure
    const success = true; // Assume success for now

    if (success) {
      toast({
        title: "¡Suscripción exitosa!",
        description: "Gracias por unirte. Te mantendremos informado.",
        variant: "default",
      });
      form.reset();
    } else {
      toast({
        title: "Error en la suscripción",
        description: "Hubo un problema al procesar tu solicitud. Inténtalo de nuevo.",
        variant: "destructive",
      });
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

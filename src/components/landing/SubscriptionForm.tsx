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
import { Dictionary } from '@/lib/translations';

interface SubscriptionFormProps {
  buttonText?: string;
  placeholderText?: string;
  translations: Dictionary; // For validation messages and toast
}

export function SubscriptionForm({ 
  buttonText = "Únete a nuestra lista de early adopters", 
  placeholderText = "tu@email.com",
  translations 
}: SubscriptionFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const subscriptionSchema = z.object({
    email: z.string().email({ message: translations.emailValidation || "Please enter a valid email." }),
  });
  type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

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
        title: translations.toastConfigErrorTitle || "Configuration Error",
        description: translations.toastConfigErrorDescription || "API URL not configured.",
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
        toast({
          title: translations.toastSuccessTitle || "Subscription successful!",
          description: translations.toastSuccessDescription || "Thanks for joining.",
          variant: "default",
        });
        form.reset();
      } else {
        toast({
          title: translations.toastErrorTitle || "Subscription error",
          description: (translations.toastErrorDescription || "Request failed (Status: {status}).").replace('{status}', response.status.toString()),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error en la llamada a la API:", error);
      toast({
        title: translations.toastNetworkErrorTitle || "Network Error",
        description: translations.toastNetworkErrorDescription || "Could not connect to server.",
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

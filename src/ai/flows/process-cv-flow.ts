
'use server';
/**
 * @fileOverview Flujo para procesar un CV y generar (simuladamente) un sitio web personal.
 *
 * - processCvAndGenerateSite - Función que maneja el procesamiento del CV.
 * - ProcessCvInput - El tipo de entrada para la función.
 * - ProcessCvOutput - El tipo de retorno para la función.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit'; // <--- CORREGIDO AQUÍ

// Esquema de entrada
const ProcessCvInputSchema = z.object({
  cvDataUri: z
    .string()
    .describe(
      "El CV como un data URI que debe incluir un MIME type y usar Base64 encoding. Esperado: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  fileName: z.string().describe('El nombre original del archivo del CV.'),
});
export type ProcessCvInput = z.infer<typeof ProcessCvInputSchema>;

// Esquema de salida
const ProcessCvOutputSchema = z.object({
  generatedSiteUrl: z.string().optional().describe('La URL del sitio web personal generado, si tuvo éxito.'),
  feedbackMessage: z.string().describe('Un mensaje de retroalimentación para el usuario sobre el proceso.'),
  processedCvSummary: z.string().optional().describe('Un resumen del CV procesado (simulado).'),
});
export type ProcessCvOutput = z.infer<typeof ProcessCvOutputSchema>;


// El prompt para Genkit
const cvProcessingPrompt = ai.definePrompt({
  name: 'cvProcessingPrompt',
  input: { schema: ProcessCvInputSchema },
  output: { schema: ProcessCvOutputSchema },
  prompt: `
    Eres JobMagnetic AI, una IA experta en transformar CVs en atractivos perfiles profesionales públicos.
    Has recibido un CV llamado "{{fileName}}".
    El contenido del CV es: {{media url=cvDataUri}}

    Tu tarea es:
    1. Simular el análisis del CV.
    2. Generar una URL ficticia para el perfil profesional público que crearías. La URL debe parecer realista, por ejemplo: https://jobmagnetic.dev/profile/[nombre-aleatorio-o-basado-en-cv].
    3. Proporcionar un mensaje de retroalimentación positivo para el usuario.
    4. Opcionalmente, puedes incluir un breve resumen de lo que "entendiste" del CV (máximo 2 frases).

    Responde ÚNICAMENTE en el formato JSON especificado. Asegúrate de que generatedSiteUrl sea una URL válida si el procesamiento es exitoso.
    Si simulas un error (por ejemplo, si el CV estuviera vacío o fuera ilegible), no incluyas generatedSiteUrl y ajusta el feedbackMessage para reflejar el problema.
    Por ahora, siempre simula un procesamiento exitoso.
  `,
  config: {
    // Podrías ajustar la temperatura u otras configuraciones aquí si es necesario.
    // temperature: 0.3 
  }
});


// El flujo principal
const processCvFlow = ai.defineFlow(
  {
    name: 'processCvFlow',
    inputSchema: ProcessCvInputSchema,
    outputSchema: ProcessCvOutputSchema,
  },
  async (input: ProcessCvInput) => {
    try {
      // Aquí es donde llamarías a tu API de backend real en el futuro,
      // pasando el input.cvDataUri (o el texto extraído del mismo) y input.fileName.
      // const backendResponse = await fetch('https://tu-api.com/generar-sitio', {
      //   method: 'POST',
      //   body: JSON.stringify({ cvContent: input.cvDataUri, fileName: input.fileName }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // if (!backendResponse.ok) {
      //   const errorData = await backendResponse.json();
      //   return {
      //     feedbackMessage: `Error del backend: ${errorData.message || 'No se pudo generar el sitio.'}`,
      //   };
      // }
      // const siteData = await backendResponse.json();
      // return {
      //   generatedSiteUrl: siteData.url,
      //   feedbackMessage: "¡Tu perfil ha sido creado y está listo para que lo compartas!",
      //   processedCvSummary: siteData.summary || "CV procesado exitosamente."
      // };

      // Por ahora, llamamos al prompt de Genkit para simular la respuesta.
      const { output } = await cvProcessingPrompt(input);

      if (!output) {
        return {
          feedbackMessage: "La IA no pudo procesar la solicitud. Intenta de nuevo.",
        };
      }
      
      // Aseguramos que la URL sea plausible y el mensaje sea amigable
      if (output.generatedSiteUrl && output.generatedSiteUrl.startsWith('https://')) {
         return {
          generatedSiteUrl: output.generatedSiteUrl,
          feedbackMessage: output.feedbackMessage || "¡Tu perfil ha sido creado y está listo!",
          processedCvSummary: output.processedCvSummary || "Hemos extraído la información clave de tu CV."
        };
      } else {
        // Si la IA devuelve algo inesperado
         return {
          feedbackMessage: "Hubo un problema generando la URL de tu perfil. Por favor, intenta de nuevo.",
          processedCvSummary: "Procesamiento simulado completado con detalles inesperados."
        };
      }

    } catch (error) {
      console.error('Error en processCvFlow:', error);
      return {
        feedbackMessage: `Ocurrió un error inesperado procesando tu CV. Detalles: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
);

// Función exportada para ser llamada desde el componente de frontend
export async function processCvAndGenerateSite(input: ProcessCvInput): Promise<ProcessCvOutput> {
  return processCvFlow(input);
}

    
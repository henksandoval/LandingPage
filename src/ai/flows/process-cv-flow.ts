
'use server';
/**
 * @fileOverview Flow to process a CV and (simulated) generate a personal website.
 *
 * - processCvAndGenerateSite - Function that handles CV processing.
 * - ProcessCvInput - The input type for the function.
 * - ProcessCvOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input schema
const ProcessCvInputSchema = z.object({
  cvDataUri: z
    .string()
    .describe(
      "The CV as a data URI that must include a MIME type and use Base64 encoding. Expected: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  fileName: z.string().describe('The original file name of the CV.'),
});
export type ProcessCvInput = z.infer<typeof ProcessCvInputSchema>;

// Output schema
const ProcessCvOutputSchema = z.object({
  generatedSiteUrl: z.string().optional().describe('The URL of the generated personal website, if successful.'),
  feedbackMessage: z.string().describe('A feedback message for the user about the process.'),
  processedCvSummary: z.string().optional().describe('A summary of the processed CV (simulated).'),
});
export type ProcessCvOutput = z.infer<typeof ProcessCvOutputSchema>;


// The Genkit prompt
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
    // You could adjust temperature or other settings here if needed.
    // temperature: 0.3
  }
});


// The main flow
const processCvFlow = ai.defineFlow(
  {
    name: 'processCvFlow',
    inputSchema: ProcessCvInputSchema,
    outputSchema: ProcessCvOutputSchema,
  },
  async (input: ProcessCvInput) => {
    try {
      // This is where you would call your actual backend API in the future,
      // passing input.cvDataUri (or extracted text from it) and input.fileName.
      // const backendResponse = await fetch('https://your-api.com/generate-site', {
      //   method: 'POST',
      //   body: JSON.stringify({ cvContent: input.cvDataUri, fileName: input.fileName }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // if (!backendResponse.ok) {
      //   const errorData = await backendResponse.json();
      //   return {
      //     feedbackMessage: \`Backend error: \${errorData.message || 'Could not generate site.'}\`,
      //   };
      // }
      // const siteData = await backendResponse.json();
      // return {
      //   generatedSiteUrl: siteData.url,
      //   feedbackMessage: "Your profile has been created and is ready for you to share!",
      //   processedCvSummary: siteData.summary || "CV processed successfully."
      // };

      // For now, we call the Genkit prompt to simulate the response.
      const { output } = await cvProcessingPrompt(input);

      if (!output) {
        return {
          feedbackMessage: "The AI could not process the request. Please try again.",
        };
      }
      
      // Ensure the URL is plausible and the message is friendly
      if (output.generatedSiteUrl && output.generatedSiteUrl.startsWith('https://')) {
         return {
          generatedSiteUrl: output.generatedSiteUrl,
          feedbackMessage: output.feedbackMessage || "Your profile has been created and is ready!",
          processedCvSummary: output.processedCvSummary || "We have extracted the key information from your CV."
        };
      } else {
        // If the AI returns something unexpected
         return {
          feedbackMessage: "There was a problem generating your profile URL. Please try again.",
          processedCvSummary: "Simulated processing completed with unexpected details."
        };
      }

    } catch (error) {
      console.error('Error in processCvFlow:', error);
      return {
        feedbackMessage: `An unexpected error occurred while processing your CV. Details: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
);

// Exported function to be called from the frontend component
export async function processCvAndGenerateSite(input: ProcessCvInput): Promise<ProcessCvOutput> {
  return processCvFlow(input);
}

    
"use client";

import { useState, ChangeEvent, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, FileText } from "lucide-react";
import { JobBotAnimation } from "./JobBotAnimation";
import type { Dictionary } from '@/lib/translations';
import type { Locale } from '@/lib/i18n-config';

import mammoth from 'mammoth';

type UploadStatus = "idle" | "fileSelected" | "processing" | "success" | "error";

interface CvUploadSectionProps {
  translations: Dictionary; // This will be t.cvUpload from the parent
  locale: Locale;
}

let pdfjsLibModule: typeof import('pdfjs-dist') | null = null;
let pdfWorkerConfigured = false;

async function loadPdfjs() {
  if (typeof window === 'undefined') {
    console.warn("loadPdfjs: Attempting to load pdfjs-dist on the server. Skipped.");
    return null;
  }

  if (pdfjsLibModule && pdfWorkerConfigured) { // Asegurarse de que el worker también esté configurado
    return pdfjsLibModule;
  }

  try {
    console.log("loadPdfjs: Attempting to dynamically import pdfjs-dist...");
    const pdfjs = await import('pdfjs-dist');
    pdfjsLibModule = pdfjs;
    console.log(`loadPdfjs: pdfjs-dist imported successfully. Version: ${pdfjs.version}`);

    if (!pdfWorkerConfigured) {
      const localWorkerPath = '/pdf.worker.min.mjs'; // Asumiendo que está en public/pdf.worker.min.js
      const cdnWorkerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

      // Para depuración, podríamos forzar el worker local primero:
      // Opción 1: Siempre usar el worker local si está disponible
      console.log(`loadPdfjs: Attempting to set workerSrc to local path: ${localWorkerPath}`);
      pdfjs.GlobalWorkerOptions.workerSrc = localWorkerPath;
      // Aquí podríamos añadir una pequeña prueba para ver si el worker local es accesible,
      // pero pdf.js lo hará internamente. Si falla, el error que viste podría reaparecer
      // pero apuntando al path local.

      // Opción 2: Intentar CDN y luego fallback (como estaba antes, pero con mejor logging)
      /*
      try {
        new URL(cdnWorkerSrc); // Validar la URL de la CDN
        console.log(`loadPdfjs: Attempting to set workerSrc to CDN: ${cdnWorkerSrc}`);
        pdfjs.GlobalWorkerOptions.workerSrc = cdnWorkerSrc;
        // Podríamos intentar un fetch aquí para ver si la CDN responde, pero es complejo
      } catch (urlError) {
        console.warn(`loadPdfjs: CDN URL for pdf.worker.js (${cdnWorkerSrc}) might be invalid or version mismatch. Falling back to local.`, urlError);
        console.log(`loadPdfjs: Setting workerSrc to local path: ${localWorkerPath}`);
        pdfjs.GlobalWorkerOptions.workerSrc = localWorkerPath;
      }
      */
      console.log(`loadPdfjs: GlobalWorkerOptions.workerSrc has been set to: ${pdfjs.GlobalWorkerOptions.workerSrc}`);
      pdfWorkerConfigured = true;
    }
    return pdfjsLibModule;
  } catch (error) {
    console.error("loadPdfjs: Error dynamically importing pdfjs-dist or configuring worker:", error);
    pdfWorkerConfigured = false; // Resetear si la configuración falló
    return null;
  }
}

const extractTextFromFile = async (file: File): Promise<string | null> => {
  const { type } = file;
  const pdfjsLib = await loadPdfjs();

  if (type === "application/pdf") {
    if (!pdfjsLib) {
      console.error("extractTextFromFile: PDF.js library is not available for processing PDF.");
      // Considera mostrar un toast al usuario aquí
      // Ejemplo: toast({ title: "Error", description: "No se pudo cargar la librería para leer PDFs.", variant: "destructive" });
      return Promise.reject(new Error("PDF processing library (pdfjs-dist) not available."));
    }
    console.log("extractTextFromFile: PDF.js library loaded, proceeding with PDF parsing.");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (!e.target?.result) {
          return reject(new Error("Error reading PDF file with FileReader."));
        }
        try {
          const typedArray = new Uint8Array(e.target.result as ArrayBuffer);
          console.log("extractTextFromFile: Attempting to getDocument from PDF data...");
          const pdfDoc = await pdfjsLib.getDocument({ data: typedArray }).promise;
          console.log(`extractTextFromFile: PDF Document loaded. Number of pages: ${pdfDoc.numPages}`);
          let textContent = "";
          for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const text = await page.getTextContent();
            textContent += text.items.map(item => ('str' in item ? item.str : '')).join(" ") + "\n";
          }
          resolve(textContent.trim());
        } catch (error) {
          console.error("extractTextFromFile: Error parsing PDF content:", error);
          reject(error); // El error original que viste probablemente se origine aquí si el worker falla
        }
      };
      reader.onerror = (e) => reject(new Error("FileReader error: " + e.target?.error?.message));
      reader.readAsArrayBuffer(file);
    });
  } else if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (!e.target?.result) {
          return reject(new Error("Error reading DOCX file."));
        }
        try {
          const result = await mammoth.extractRawText({ arrayBuffer: e.target.result as ArrayBuffer });
          resolve(result.value);
        } catch (error) {
          console.error("Error parsing DOCX with mammoth:", error);
          reject(error);
        }
      };
      reader.onerror = (e) => reject(new Error("FileReader error: " + e.target?.error?.message));
      reader.readAsArrayBuffer(file);
    });
  } else if (type === "text/plain") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          resolve(e.target.result);
        } else {
          reject(new Error("Error reading text file."));
        }
      };
      reader.onerror = (e) => reject(new Error("FileReader error: " + e.target?.error?.message));
      reader.readAsText(file);
    });
  } else if (type === "application/msword") {
    console.warn(".doc files are not directly supported for client-side text extraction.");
    return Promise.resolve(null);
  }

  console.warn(`Unsupported file type for client-side text extraction: ${type}`);
  return Promise.resolve(null);
};

interface CvUploadSectionProps {
  translations: Dictionary; // This will be t.cvUpload from the parent
  locale: Locale;
}

export function CvUploadSection({ translations: t, locale }: CvUploadSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log("CvUploadSection: Component did mount on client, pre-loading pdfjs.");
      loadPdfjs().then(lib => {
        if (lib) {
          console.log("CvUploadSection: pdfjs pre-loaded and worker configured successfully.");
        } else {
          console.error("CvUploadSection: Failed to pre-load pdfjs or configure worker.");
        }
      });
    }
  }, []);


  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "application/msword"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: t.toast?.unsupportedTypeTitle || "Unsupported file type",
          description: t.toast?.unsupportedTypeDescription || "Please upload a PDF, DOCX, or text file.",
          variant: "destructive",
        });
        setSelectedFile(null);
        setStatus("idle");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          title: t.toast?.fileTooLargeTitle || "File too large",
          description: t.toast?.fileTooLargeDescription || "Maximum allowed size is 5MB.",
          variant: "destructive",
        });
        setSelectedFile(null);
        setStatus("idle");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setSelectedFile(file);
      setStatus("processing");

      try {
        console.log(`handleFileChange: Attempting to extract text from: ${file.name} (Type: ${file.type})`);
        const extractedText = await extractTextFromFile(file);

        if (extractedText) {
          console.log("--- Extracted CV Text START ---");
          console.log(extractedText);
          console.log("--- Extracted CV Text END ---");
          toast({
            title: t.toast?.textExtractedTitle || "Text Extracted",
            description: t.toast?.textExtractedDescription || "CV content has been logged to the browser console.",
            variant: "default",
          });
        } else {
          // Si extractedText es null Y el tipo no es PDF (ya que PDF maneja su error de carga de librería)
          if (extractedText === null && file.type !== "application/pdf") {
            if (file.type === "application/msword") {
              toast({
                title: t.toast?.docNotSupportedTitle || ".doc File Notice",
                description: t.toast?.docNotSupportedDescription || "Client-side text extraction for .doc files is not supported. Please convert to DOCX, PDF, or TXT for content preview.",
                variant: "warning",
                duration: 8000,
              });
            } else { // Otros tipos no soportados para extracción o fallo silencioso
              toast({
                title: t.toast?.extractionUnavailableTitle || "Text Extraction Not Available",
                description: t.toast?.extractionUnavailableDescription || "Could not automatically extract text from this file type for console logging.",
                variant: "info",
                duration: 7000,
              });
            }
          }
        }
        setStatus("fileSelected");
      } catch (error) {
        console.error("handleFileChange: Error extracting text from file:", error);
        const errorMsg = error instanceof Error ? error.message : "Unknown error during text extraction.";
        if (errorMsg !== "PDF processing library (pdfjs-dist) not available.") { // Evitar toast duplicado
          toast({
            title: t.toast?.extractionErrorTitle || "Text Extraction Error",
            description: (t.toast?.extractionErrorDescription || "Failed to extract text for console logging: {errorMsg}.").replace('{errorMsg}', errorMsg),
            variant: "destructive",
          });
        } else { // Error específico de la librería PDF no disponible
          toast({
            title: t.toast?.pdfLibraryErrorTitle || "PDF Processing Error",
            description: (t.toast?.pdfLibraryErrorDescription || "Could not process the PDF file. The necessary library might have failed to load: {errorMsg}.").replace('{errorMsg}', errorMsg),
            variant: "destructive",
          });
        }
        setStatus("fileSelected");
      }
    } else {
      setSelectedFile(null);
      setStatus("idle");
    }
  };

  const handleUploadAndProcess = async () => {
    if (!selectedFile) {
      toast({
        title: t.toast?.noFileSelectedTitle || "No file selected",
        description: t.toast?.noFileSelectedDescription || "Please select a file to continue.",
        variant: "destructive",
      });
      return;
    }

    setStatus("processing");
    console.log(`Simulating processing for: ${selectedFile.name}. Backend integration is removed.`);

    toast({
      title: t.toast?.backendProcessingSkippedTitle || "Backend Processing Not Implemented",
      description: t.toast?.backendProcessingSkippedDescription || "The step to create a profile on the server has been removed or is not configured in this version.",
      variant: "info",
      duration: 5000,
    });

    setTimeout(() => {
      setStatus("idle");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 1500);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const renderDropZoneContent = () => {
    if (status === "processing") {
      return (
          <>
            <JobBotAnimation containerClassName="mx-auto mb-4" botClassName="h-32 w-32 text-primary" />
            <p className="text-primary font-medium text-lg">{t.status?.processingTitle || "Processing..."}</p>
            <p className="text-muted-foreground/80">{t.status?.processingDescription || "Please wait a moment."}</p>
          </>
      );
    }
    if (selectedFile && status === "fileSelected") {
      return (
          <>
            <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-foreground font-medium text-lg truncate max-w-full px-4" title={selectedFile.name}>
              {(t.dropzone?.fileSelected || "File: {fileName}").replace('{fileName}', selectedFile.name)}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {(t.dropzone?.fileSize || "({fileSize} MB)").replace('{fileSize}', (selectedFile.size / 1024 / 1024).toFixed(2))}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">{t.dropzone?.readyToProcess || "Ready to process!"}</p>
          </>
      );
    }
    return (
        <>
          <UploadCloud className="h-12 w-12 text-muted-foreground/70 mx-auto mb-4 group-hover:text-primary transition-colors duration-300" />
          <p className="text-muted-foreground font-medium text-lg">
            {t.dropzone?.dragAndDrop || "Drag and drop your CV here"}
          </p>
          <p className="text-muted-foreground/80">{t.dropzone?.clickToSelect || "or click to select"}</p>
          <p className="text-xs text-muted-foreground/60 mt-3">
            {t.dropzone?.fileTypes || "(PDF, DOCX, TXT - Max 5MB)"}
          </p>
        </>
    );
  };

  const termsLinkText = t.termsLink || "Terms of Service";
  const privacyLinkText = t.privacyLink || "Privacy Policy";
  const termsAndPrivacyNotice = (t.termsAndPrivacyNotice || "By uploading your CV, you agree to our {termsLink} and {privacyLink}.")
      .replace('{termsLink}', `<a href="/${locale}/terms" class="underline hover:text-primary">${termsLinkText}</a>`)
      .replace('{privacyLink}', `<a href="/${locale}/privacy" class="underline hover:text-primary">${privacyLinkText}</a>`);

  return (
      <section id="upload-cv" className="py-16 md:py-24 bg-gradient-to-br from-background via-secondary/20 to-background">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="max-w-3xl mx-auto text-center shadow-2xl hover:shadow-light-primary-glow-xl dark:hover:shadow-dark-accent-glow-xl border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 transform hover:scale-[1.01]">
            <CardHeader className="pb-4">
              <div className="mx-auto bg-primary/10 p-5 rounded-full w-fit mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="h-16 w-16 text-primary" strokeWidth={1.5} />
              </div>
              <CardTitle className="text-3xl md:text-4xl font-bold font-heading mb-3 text-foreground">
                {t.title}
              </CardTitle>
              <CardDescription className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto"
                               dangerouslySetInnerHTML={{ __html: t.description }}/>
            </CardHeader>
            <CardContent className="pt-2 pb-8 px-6 md:px-10">
              <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  disabled={status === "processing"}
              />
              <div
                  className={`mt-6 mb-8 border-2 border-dashed rounded-xl p-8 md:p-12 transition-colors duration-300 bg-muted/10 group
                ${status === "processing" ? "border-primary/70 cursor-default" : "hover:border-primary/70 cursor-pointer border-muted-foreground/40"}`}
                  onClick={status !== "processing" ? triggerFileInput : undefined}
                  role={status !== "processing" ? "button" : undefined}
                  tabIndex={status !== "processing" ? 0 : undefined}
                  onKeyPress={(e) => status !== "processing" && e.key === 'Enter' && triggerFileInput()}
                  aria-label={t.dropzone?.dragAndDrop || "Drag and drop your CV here or click to select"}
              >
                {renderDropZoneContent()}
              </div>

              {(status === "idle" || status === "fileSelected") && (
                  <Button
                      size="lg"
                      className="py-7 px-10 text-lg rounded-lg shadow-md hover:shadow-light-primary-glow-md dark:hover:shadow-dark-accent-glow-md transition-shadow duration-300 w-full md:w-auto"
                      onClick={handleUploadAndProcess}
                      disabled={!selectedFile || status === "processing"}
                  >
                    <UploadCloud className="mr-3 h-6 w-6" />
                    {selectedFile ? (t.button?.createProfile || "Create Profile with this CV") : (t.button?.selectFirst || "Select a CV first")}
                  </Button>
              )}

              <p className="mt-8 text-xs text-muted-foreground/80"
                 dangerouslySetInnerHTML={{ __html: termsAndPrivacyNotice }} />
            </CardContent>
          </Card>
        </div>
      </section>
  );
}
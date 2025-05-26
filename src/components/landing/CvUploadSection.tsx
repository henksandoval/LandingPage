"use client";

import { useState, ChangeEvent, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {toast, useToast} from "@/hooks/use-toast";
import { UploadCloud, Link as LinkIcon, FileText, AlertTriangle } from "lucide-react";
import Link from 'next/link';
import { JobBotAnimation } from "./JobBotAnimation";
import type { Dictionary } from '@/lib/translations';
import type { Locale } from '@/lib/i18n-config';

import mammoth from 'mammoth';

type UploadStatus = "idle" | "fileSelected" | "processing" | "success" | "error";

interface CvUploadSectionProps {
  translations: Dictionary;
  locale: Locale;
}

let pdfjsLibModule: typeof import('pdfjs-dist') | null = null;
let pdfWorkerConfigured = false;

async function loadPdfjs() {
  if (typeof window === 'undefined') {
    console.warn("loadPdfjs: Attempting to load pdfjs-dist on the server. Skipped.");
    return null;
  }

  if (pdfjsLibModule && pdfWorkerConfigured) {
    return pdfjsLibModule;
  }

  try {
    console.log("loadPdfjs: Attempting to dynamically import pdfjs-dist...");
    const pdfjs = await import('pdfjs-dist');
    pdfjsLibModule = pdfjs;
    console.log(`loadPdfjs: pdfjs-dist imported successfully. Version: ${pdfjs.version}`);

    if (!pdfWorkerConfigured) {
      const localWorkerPath = '/pdf.worker.min.mjs';
      const cdnWorkerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`;

      try {
        new URL(cdnWorkerSrc);
        console.log(`loadPdfjs: Attempting to set workerSrc to CDN: ${cdnWorkerSrc}`);
        pdfjs.GlobalWorkerOptions.workerSrc = cdnWorkerSrc;
      } catch (urlError) {
        console.warn(`loadPdfjs: CDN URL for pdf.worker.js (${cdnWorkerSrc}) might be invalid or version mismatch. Falling back to local.`, urlError);
        console.log(`loadPdfjs: Setting workerSrc to local path: ${localWorkerPath}`);
        pdfjs.GlobalWorkerOptions.workerSrc = localWorkerPath;
      }

      console.log(`loadPdfjs: GlobalWorkerOptions.workerSrc has been set to: ${pdfjs.GlobalWorkerOptions.workerSrc}`);
      pdfWorkerConfigured = true;
    }
    return pdfjsLibModule;
  } catch (error) {
    console.error("loadPdfjs: Error dynamically importing pdfjs-dist or configuring worker:", error);
    pdfWorkerConfigured = false;
    return null;
  }
}

const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && e.target.result instanceof ArrayBuffer) {
        resolve(e.target.result);
      } else {
        reject(new Error("Error reading file as ArrayBuffer or result is not an ArrayBuffer."));
      }
    };
    reader.onerror = (e) => {
      console.error("FileReader error (ArrayBuffer):", e.target?.error);
      reject(new Error("FileReader error (ArrayBuffer): " + e.target?.error?.message));
    };
    reader.readAsArrayBuffer(file);
  });
};

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        resolve(e.target.result);
      } else {
        reject(new Error("Error reading file as text or result is not a string."));
      }
    };
    reader.onerror = (e) => {
      console.error("FileReader error (Text):", e.target?.error);
      reject(new Error("FileReader error (Text): " + e.target?.error?.message));
    };
    reader.readAsText(file);
  });
};

const extractTextFromFile = async (file: File): Promise<string | null> => {
  const MIN_PROCESSING_DURATION_MS = 5000;

  const startTime = Date.now();

  const performActualExtraction = async (): Promise<string | null> => {
    const { type } = file;
    const pdfjsLib = await loadPdfjs();

    if (type === "application/pdf") {
      if (!pdfjsLib) {
        toast({ title: "Error", description: "Could not load the library to read PDFs.", variant: "destructive" });
        throw new Error("PDF processing library (pdfjs-dist) not available.");
      }
      console.log("extractTextFromFile: PDF.js library loaded, processing PDF...");

      try {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const typedArray = new Uint8Array(arrayBuffer);
        console.log("extractTextFromFile: Attempting to get document from PDF data...");
        const pdfDoc = await pdfjsLib.getDocument({ data: typedArray }).promise;
        console.log(`extractTextFromFile: PDF document loaded. Number of pages: ${pdfDoc.numPages}`);
        let textContent = "";
        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const text = await page.getTextContent();
          textContent += text.items.map(item => (item && 'str' in item && typeof item.str === 'string' ? item.str : '')).join(" ") + "\n";
        }
        return textContent.trim();
      } catch (error) {
        console.error("extractTextFromFile: Error during PDF processing:", error);
        throw error;
      }

    } else if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      console.log("extractTextFromFile: Processing DOCX with Mammoth...");
      try {
        const arrayBuffer = await readFileAsArrayBuffer(file);

        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      } catch (error) {
        console.error("Error parsing DOCX with mammoth:", error);
        throw error;
      }
    } else if (type === "text/plain") {
      console.log("extractTextFromFile: Processing plain text file...");
      try {
        return await readFileAsText(file);
      } catch (error) {
        console.error("Error reading text file:", error);
        throw error;
      }
    } else if (type === "application/msword") {
      console.warn(".doc files are not directly supported for client-side text extraction.");
      return null;
    }

    console.warn(`Unsupported file type for client-side text extraction: ${type}`);
    return null;
  };

  try {
    const extractedText = await performActualExtraction();

    const elapsedTime = Date.now() - startTime;
    console.log(`Actual text extraction took ${elapsedTime}ms.`);

    if (elapsedTime < MIN_PROCESSING_DURATION_MS) {
      const delayRequired = MIN_PROCESSING_DURATION_MS - elapsedTime;
      console.log(`Waiting an additional ${delayRequired}ms to reach the minimum duration of ${MIN_PROCESSING_DURATION_MS}ms.`);
      await new Promise(resolve => setTimeout(resolve, delayRequired));
    }

    console.log(`Total duration (with possible delay): ${Date.now() - startTime}ms.`);
    return extractedText;

  } catch (error) {
    console.error("Error in the text extraction process:", error);
    const elapsedTime = Date.now() - startTime;
    console.log(`Extraction failed after ${elapsedTime}ms (real time).`);

    if (elapsedTime < MIN_PROCESSING_DURATION_MS) {
      const delayRequired = MIN_PROCESSING_DURATION_MS - elapsedTime;
      console.log(`Waiting an additional ${delayRequired}ms before propagating the error (to meet minimum duration).`);
      await new Promise(resolve => setTimeout(resolve, delayRequired));
    }

    console.log(`Total duration (with error and possible delay): ${Date.now() - startTime}ms.`);
    throw error;
  }
};

interface CvUploadSectionProps {
  translations: Dictionary;
  locale: Locale;
}

export function CvUploadSection({ translations: t, locale }: CvUploadSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [generatedSiteUrl, setGeneratedSiteUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
      if (file.size > 5 * 1024 * 1024) {
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
      setGeneratedSiteUrl(null);
      setErrorMessage(null);

      try {
        console.log(`handleFileChange: Attempting to extract text from: ${file.name} (Type: ${file.type})`);
        const extractedText = await extractTextFromFile(file);

        if (extractedText) {
          console.log(extractedText);
        } else {
          if (extractedText === null && file.type !== "application/pdf") {
            if (file.type === "application/msword") {
              toast({
                title: t.toast?.docNotSupportedTitle || ".doc File Notice",
                description: t.toast?.docNotSupportedDescription || "Client-side text extraction for .doc files is not supported. Please convert to DOCX, PDF, or TXT for content preview.",
                variant: "warning",
                duration: 8000,
              });
            } else {
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
        if (errorMsg !== "PDF processing library (pdfjs-dist) not available.") {
          toast({
            title: t.toast?.extractionErrorTitle || "Text Extraction Error",
            description: (t.toast?.extractionErrorDescription || "Failed to extract text for console logging: {errorMsg}.").replace('{errorMsg}', errorMsg),
            variant: "destructive",
          });
        } else {
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
    setGeneratedSiteUrl(null);
    setErrorMessage(null);

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
          <p className="text-primary font-medium text-lg">{t.status?.processingTitle || "Our JobBot is in action..."}</p>
          <p className="text-muted-foreground/80">{t.status?.processingDescription || "Creating your unique professional profile."}</p>
        </>
      );
    }
    if (selectedFile && (status === "fileSelected" || status === "error" || status === "success")) {
      return (
        <>
          <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-foreground font-medium text-lg truncate max-w-full px-4" title={selectedFile.name}>
            {(t.dropzone?.fileSelected || "File: {fileName}").replace('{fileName}', selectedFile.name)}
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            {(t.dropzone?.fileSize || "({fileSize} MB)").replace('{fileSize}', (selectedFile.size / 1024 / 1024).toFixed(2))}
          </p>
           {status === "fileSelected" && (
             <p className="text-sm text-green-600 dark:text-green-400 mt-2">{t.dropzone?.readyToProcess || "Ready to process!"}</p>
           )}
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
                ${status === "processing" ? "border-primary/70 cursor-default" : "hover:border-primary/70 cursor-pointer border-muted-foreground/40"}
                ${status === "error" ? "border-destructive/70" : ""}`}
              onClick={status !== "processing" ? triggerFileInput : undefined}
              role={status !== "processing" ? "button" : undefined}
              tabIndex={status !== "processing" ? 0 : undefined}
              onKeyPress={(e) => status !== "processing" && e.key === 'Enter' && triggerFileInput()}
              aria-label={t.dropzone?.dragAndDrop || "Drag and drop your CV here or click to select"}
            >
              {renderDropZoneContent()}
            </div>

            {status === "success" && generatedSiteUrl && (
              <div className="mt-6 mb-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg text-left">
                <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center">
                  <LinkIcon className="h-6 w-6 mr-2 text-green-600 dark:text-green-400" />
                  {t.status?.successTitle || "Your Profile is Ready!"}
                </h3>
                <p className="text-green-600 dark:text-green-400/90 mb-3">
                  {t.status?.successMessage || "We have generated your professional profile. You can view it here:"}
                </p>
                <Link href={generatedSiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-medium underline hover:text-primary/80 break-all">
                  {generatedSiteUrl}
                </Link>
                 <Button onClick={() => { setStatus("idle"); setSelectedFile(null); setGeneratedSiteUrl(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="mt-4 w-full md:w-auto">
                  {t.button?.uploadAnother || "Upload another CV"}
                </Button>
              </div>
            )}

            {status === "error" && errorMessage && (
              <div className="mt-6 mb-8 p-4 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-left">
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                  {t.status?.errorTitle || "Processing Error"}
                </h3>
                <p className="text-red-600 dark:text-red-400/90 text-sm">{errorMessage}</p>
                <Button variant="outline" onClick={handleUploadAndProcess} disabled={!selectedFile} className="mt-4 mr-2">
                  {t.status?.tryAgainButton || "Try Again"}
                </Button>
                 <Button variant="secondary" onClick={() => { setStatus("idle"); setSelectedFile(null); setErrorMessage(null); if (fileInputRef.current) fileInputRef.current.value = "";}} className="mt-4">
                  {t.status?.selectAnotherFileButton || "Select another file"}
                </Button>
              </div>
            )}

            {(status === "idle" || status === "fileSelected") && (
              <Button
                size="lg"
                className="py-7 px-10 text-lg rounded-lg shadow-md hover:shadow-light-primary-glow-md dark:hover:shadow-dark-accent-glow-md transition-shadow duration-300 w-full md:w-auto"
                onClick={handleUploadAndProcess}
                disabled={!selectedFile}
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


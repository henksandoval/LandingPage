
"use client";

import { useState, ChangeEvent, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {toast, useToast} from "@/hooks/use-toast";
import { UploadCloud, Link as LinkIconLucide, FileText, AlertTriangle, ExternalLink } from "lucide-react"; // Renamed Link to LinkIconLucide
import Link from 'next/link';
import { JobBotAnimation } from "./JobBotAnimation";
import type { Dictionary } from '@/lib/translations';
import type { Locale } from '@/lib/i18n-config';

import mammoth from 'mammoth';

type UploadStatus = "idle" | "fileSelected" | "analyzing" | "creatingProfile" | "success" | "error";

interface CvUploadSectionProps {
  translations: Dictionary; // This will be t.cvUpload from parent
  locale: Locale;
  apiEndpoint: string;
  viewerUrl: string;
  sampleUrl: string;
}

let pdfjsLibModule: typeof import('pdfjs-dist') | null = null;
let pdfWorkerConfigured = false;

async function loadPdfjs() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (pdfjsLibModule && pdfWorkerConfigured) {
    return pdfjsLibModule;
  }

  try {
    const pdfjs = await import('pdfjs-dist');
    pdfjsLibModule = pdfjs;

    if (!pdfWorkerConfigured) {
      const localWorkerPath = '/pdf.worker.min.mjs';
      const cdnWorkerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`;

      try {
        new URL(cdnWorkerSrc);
        pdfjs.GlobalWorkerOptions.workerSrc = cdnWorkerSrc;
      } catch (urlError) {
        pdfjs.GlobalWorkerOptions.workerSrc = localWorkerPath;
      }

      pdfWorkerConfigured = true;
    }
    return pdfjsLibModule;
  } catch (error) {
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

      try {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const typedArray = new Uint8Array(arrayBuffer);
        const pdfDoc = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let textContent = "";
        for (let i = 1; i <= pdfDoc.numPages; i++) {
          let textContentPage = "";
          const page = await pdfDoc.getPage(i);
          const text = await page.getTextContent();
          textContentPage = text.items.map(item => (item && 'str' in item && typeof item.str === 'string' ? item.str : '')).join(" ") + "\n";
          textContent += textContentPage;
        }
        return textContent.trim();
      } catch (error) {
        throw error;
      }

    } else if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      try {
        const arrayBuffer = await readFileAsArrayBuffer(file);

        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      } catch (error) {
        throw error;
      }
    } else if (type === "text/plain") {
      try {
        return await readFileAsText(file);
      } catch (error) {
        throw error;
      }
    } else if (type === "application/msword") {
      return null;
    }

    return null;
  };

  try {
    const extractedText = await performActualExtraction();

    const elapsedTime = Date.now() - startTime;

    if (elapsedTime < MIN_PROCESSING_DURATION_MS) {
      const delayRequired = MIN_PROCESSING_DURATION_MS - elapsedTime;
      await new Promise(resolve => setTimeout(resolve, delayRequired));
    }

    return extractedText;

  } catch (error) {
    const elapsedTime = Date.now() - startTime;

    if (elapsedTime < MIN_PROCESSING_DURATION_MS) {
      const delayRequired = MIN_PROCESSING_DURATION_MS - elapsedTime;
      await new Promise(resolve => setTimeout(resolve, delayRequired));
    }

    throw error;
  }
};


export function CvUploadSection({ translations: t, locale, apiEndpoint, viewerUrl, sampleUrl}: CvUploadSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [generatedSiteUrl, setGeneratedSiteUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const apiUrl = apiEndpoint + "v1/profile/create-from-cv";
  const cvViewerUrl = viewerUrl;
  const sampleProfileUrl = sampleUrl;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadPdfjs().then(lib => {
        if (lib) {
          console.log("CvUploadSection: pdfjs pre-loaded and worker configured successfully.");
        } else {
          console.error("CvUploadSection: Failed to pre-load pdfjs or configure worker.");
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setCvText(null);
    }
  }, [selectedFile]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setSelectedFile(null);
    setCvText(null);
    setGeneratedSiteUrl(null);
    setErrorMessage(null);
    setStatus("idle");

    if (file) {
      const allowedTypes = ["application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: t.toast?.unsupportedTypeTitle || "Unsupported file type",
          description: t.toast?.unsupportedTypeDescription || "Please upload a PDF file.",
          variant: "destructive",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t.toast?.fileTooLargeTitle || "File too large",
          description: t.toast?.fileTooLargeDescription || "Maximum allowed size is 5MB.",
          variant: "destructive",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setSelectedFile(file);
      setStatus("analyzing");

      try {
        const extractedText = await extractTextFromFile(file);

        if (extractedText === null) {
          toast({
            title: t.toast?.extractionUnavailableTitle || "Text Extraction Not Available",
            description: t.toast?.extractionUnavailableDescription || "Could not automatically extract text from this file type for console logging.",
            variant: "info",
            duration: 7000,
          });
        }
        setCvText(extractedText);
        setStatus("fileSelected");
      } catch (error) {
        setCvText(null);
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
        setStatus("fileSelected"); // Or "idle" if we want to fully reset
      }
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

    if (!cvText || cvText.trim() === "") {
      toast({
        title: t.toast?.noTextExtractedTitle || "No Text Extracted",
        description: t.toast?.noTextExtractedDescription || "Could not extract text from the file, or the file is empty. Please try another file.",
        variant: "destructive",
      });
      setStatus("fileSelected"); // Revert to fileSelected to allow retry or new file
      return;
    }

    setStatus("creatingProfile");
    setGeneratedSiteUrl(null);
    setErrorMessage(null);

    if (!apiUrl) {
      setErrorMessage("API configuration error (base URL). Please contact support.");
      setStatus("error");
      return;
    }

    if (!cvViewerUrl) {
      setErrorMessage("CV Viewer URL configuration error. Please contact support.");
      setStatus("error");
      return;
    }

    const formData = new FormData();

    const originalFileNameWithoutExtension = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    const textFileName = `${originalFileNameWithoutExtension}.txt`;

    const textFileObject = new File([cvText], textFileName, {
      type: "text/plain",
      lastModified: new Date().getTime()
    });

    formData.append('cvFile', textFileObject);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: "Failed to parse error response from the server.", error: e };
        }
        throw new Error(errorData?.message || errorData?.error || `API request failed with status ${response.status}`);
      }

      const result = await response.json();

      if (result.profileUrl) {
        const cvUrl = `${viewerUrl}${locale}/${result.profileUrl}`;
        setGeneratedSiteUrl(cvUrl);
        setStatus("success");
        toast({
          title: t.toast?.profileCreatedSuccessTitle || "Profile Created!", // Use a more specific success key if available
          description: t.toast?.profileCreatedDescription || "Your professional profile has been successfully created.",
        });
      } else {
        throw new Error(result.error || result.message || "API did not return the expected successful response structure.");
      }
    } catch (error) {
      const apiErrorMsg = error instanceof Error ? error.message : "Failed to process CV on the server.";
      setErrorMessage(apiErrorMsg);
      setStatus("error");
      toast({
        title: t.toast?.apiErrorTitle || "Processing Failed", // More generic API error
        description: apiErrorMsg,
        variant: "destructive",
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const isProcessing = status === "analyzing" || status === "creatingProfile";

  const renderDropZoneContent = () => {
    if (status === "analyzing") {
      return (
        <>
          <JobBotAnimation containerClassName="mx-auto mb-4" botClassName="h-32 w-32 text-primary" />
          <p className="text-primary font-medium text-lg">{t.status?.analyzingTitle || "JobBot is Reviewing Your CV..."}</p>
          <p className="text-muted-foreground/80">{t.status?.analyzingDescription || "Getting everything ready to build your profile. One moment!"}</p>
        </>
      );
    }
    if (status === "creatingProfile") {
      return (
        <>
          <JobBotAnimation containerClassName="mx-auto mb-4" botClassName="h-32 w-32 text-primary" />
          <p className="text-primary font-medium text-lg">{t.status?.processingTitle || "JobBot is Working its Magic!"}</p>
          <p className="text-muted-foreground/80">{t.status?.processingDescription || "Transforming your CV into an impactful web profile."}</p>
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
          {t.dropzone?.fileTypes || "(PDF - Max 5MB)"}
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
    <section id="upload-cv" className="pb-16 md:pb-24 pt-0 md:pt-0 bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="max-w-3xl mx-auto text-center shadow-2xl hover:shadow-light-primary-glow-xl dark:hover:shadow-dark-accent-glow-xl border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 transform hover:scale-[1.01]">
          <CardHeader className="pb-4 pt-8">
            <div className="mx-auto bg-primary/10 p-5 rounded-full w-fit mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className="h-16 w-16 text-primary" strokeWidth={1.5} />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold font-heading mb-3 text-foreground">
              {t.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 pb-8 px-6 md:px-10">
            <p className="text-sm text-muted-foreground mb-6">
              {t.demoPrompt}{' '}
              <Link 
                href={sampleProfileUrl} 
                className="text-primary hover:text-primary/80 underline font-medium inline-flex items-center"
                {...{ target: "_blank", rel: "noopener noreferrer" } }
              >
                {t.demoLinkText}
                <ExternalLink className="ml-1.5 h-4 w-4" />
              </Link>
            </p>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf"
              disabled={isProcessing}
            />
            <div
              className={`mb-8 border-2 border-dashed rounded-xl p-8 md:p-12 transition-colors duration-300 bg-muted/10 group
                ${isProcessing ? "border-primary/70 cursor-default" : "hover:border-primary/70 cursor-pointer border-muted-foreground/40"}
                ${status === "error" ? "border-destructive/70" : ""}`}
              onClick={!isProcessing ? triggerFileInput : undefined}
              role={!isProcessing ? "button" : undefined}
              tabIndex={!isProcessing ? 0 : undefined}
              onKeyPress={(e) => !isProcessing && e.key === 'Enter' && triggerFileInput()}
              aria-label={t.dropzone?.dragAndDrop || "Drag and drop your CV here or click to select"}
            >
              {renderDropZoneContent()}
            </div>

            {status === "success" && generatedSiteUrl && (
              <div className="mt-6 mb-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg text-left">
                <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center">
                  <LinkIconLucide className="h-6 w-6 mr-2 text-green-600 dark:text-green-400" />
                  {t.status?.successTitle || "Your Profile is Ready!"}
                </h3>
                <p className="text-green-600 dark:text-green-400/90 mb-3">
                  {t.status?.successMessage || "We have generated your professional profile. You can view it here:"}
                </p>
                <div>
                  <Link href={generatedSiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-medium underline hover:text-primary/80 break-all">
                    {generatedSiteUrl}
                  </Link>
                </div>
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
                <Button variant="outline" onClick={handleUploadAndProcess} disabled={!selectedFile || !cvText} className="mt-4 mr-2">
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

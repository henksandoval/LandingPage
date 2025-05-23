"use client";

import { useState, ChangeEvent, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Link as LinkIcon, FileText, AlertTriangle } from "lucide-react";
import Link from 'next/link';
import { processCvAndGenerateSite, type ProcessCvOutput } from "@/ai/flows/process-cv-flow";
import { JobBotAnimation } from "./JobBotAnimation"; 
import { Dictionary } from '@/lib/translations';
import type { Locale } from '@/lib/i18n-config';

type UploadStatus = "idle" | "fileSelected" | "processing" | "success" | "error";

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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
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
      setStatus("fileSelected");
      setGeneratedSiteUrl(null);
      setErrorMessage(null);
    }
  };

  const convertFileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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

    try {
      const cvDataUri = await convertFileToDataURL(selectedFile);
      // Note: processCvAndGenerateSite might need to be locale-aware for its feedback messages in the future
      const result: ProcessCvOutput = await processCvAndGenerateSite({
        cvDataUri,
        fileName: selectedFile.name,
      });

      if (result.generatedSiteUrl) {
        setGeneratedSiteUrl(result.generatedSiteUrl);
        setStatus("success");
        toast({
          title: t.toast?.profileCreatedSuccessTitle || "Profile Created Successfully!",
          description: result.feedbackMessage, // This message comes from AI, may need localization in flow
          variant: "default",
        });
      } else {
        setErrorMessage(result.feedbackMessage || "Ocurrió un error al procesar tu CV.");
        setStatus("error");
        toast({
          title: t.toast?.processingErrorTitle || "Processing Error",
          description: result.feedbackMessage || "No se pudo generar tu perfil. Intenta de nuevo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error processing CV:", error);
      const errorMsg = error instanceof Error ? error.message : "Error desconocido durante el procesamiento.";
      setErrorMessage(errorMsg);
      setStatus("error");
      toast({
        title: t.toast?.criticalErrorTitle || "Critical Error",
        description: (t.toast?.criticalErrorDescription || "An unexpected issue occurred: {errorMsg}.").replace('{errorMsg}', errorMsg),
        variant: "destructive",
      });
    } finally {
      if (status !== "error") {
          setSelectedFile(null); 
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const renderDropZoneContent = () => {
    if (status === "processing") {
      return (
        <>
          <JobBotAnimation className="h-32 w-32 text-primary mx-auto mb-4" />
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
    .replace('{termsLink}', `<a href="/${locale}/terminos" class="underline hover:text-primary">${termsLinkText}</a>`)
    .replace('{privacyLink}', `<a href="/${locale}/privacidad" class="underline hover:text-primary">${privacyLinkText}</a>`);


  return (
    <section id="upload-cv" className="py-16 md:py-24 bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="max-w-3xl mx-auto text-center shadow-2xl dark:hover:shadow-dark-accent-glow-xl border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 transform hover:scale-[1.01]">
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
              aria-label="Zona para arrastrar y soltar o seleccionar archivo de CV"
            >
              {renderDropZoneContent()}
            </div>

            {status === "success" && generatedSiteUrl && (
              <div className="mt-6 mb-8 p-6 bg-green-50 dark:bg-green-800/30 border border-green-300 dark:border-green-700 rounded-lg text-left">
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
                className="py-7 px-10 text-lg rounded-lg shadow-lg hover:shadow-xl dark:hover:shadow-dark-accent-glow-md transition-shadow duration-300 w-full md:w-auto"
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


"use client";

import { useState, ChangeEvent, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Link as LinkIcon, FileText, AlertTriangle, Bot } from "lucide-react";
import Link from 'next/link';
import { processCvAndGenerateSite, type ProcessCvOutput } from "@/ai/flows/process-cv-flow";
import { JobBotAnimation } from "./JobBotAnimation"; // Importar el nuevo robot animado

type UploadStatus = "idle" | "fileSelected" | "processing" | "success" | "error";

export function CvUploadSection() {
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
          title: "Tipo de archivo no soportado",
          description: "Por favor, sube un PDF, DOCX o archivo de texto.",
          variant: "destructive",
        });
        setSelectedFile(null);
        setStatus("idle");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          title: "Archivo demasiado grande",
          description: "El tamaño máximo permitido es 5MB.",
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
        title: "Ningún archivo seleccionado",
        description: "Por favor, selecciona un archivo para continuar.",
        variant: "destructive",
      });
      return;
    }

    setStatus("processing");
    setGeneratedSiteUrl(null);
    setErrorMessage(null);

    try {
      const cvDataUri = await convertFileToDataURL(selectedFile);
      const result: ProcessCvOutput = await processCvAndGenerateSite({
        cvDataUri,
        fileName: selectedFile.name,
      });

      if (result.generatedSiteUrl) {
        setGeneratedSiteUrl(result.generatedSiteUrl);
        setStatus("success");
        toast({
          title: "¡Perfil Creado Exitosamente!",
          description: result.feedbackMessage,
          variant: "default",
        });
      } else {
        setErrorMessage(result.feedbackMessage || "Ocurrió un error al procesar tu CV.");
        setStatus("error");
        toast({
          title: "Error en el Procesamiento",
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
        title: "Error Crítico",
        description: `Hubo un problema inesperado: ${errorMsg}. Por favor, contacta a soporte si el problema persiste.`,
        variant: "destructive",
      });
    } finally {
      // No limpiar el selectedFile aquí para permitir reintentos si es un error no crítico.
      // Limpiar fileInputRef para que el usuario pueda volver a seleccionar el mismo archivo si es necesario.
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (status !== "error") { // Solo limpiar el selectedFile si no es un error que permita reintentar
          setSelectedFile(null);
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
          <p className="text-primary font-medium text-lg">Nuestro JobBot está en acción...</p>
          <p className="text-muted-foreground/80">Creando tu perfil profesional único.</p>
        </>
      );
    }
    if (selectedFile && (status === "fileSelected" || status === "error" || status === "success")) { // Incluir success para que muestre el archivo mientras el mensaje de éxito está activo
      return (
        <>
          <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-foreground font-medium text-lg truncate max-w-full px-4" title={selectedFile.name}>
            Archivo: {selectedFile.name}
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
           {status === "fileSelected" && (
             <p className="text-sm text-green-600 mt-2">¡Listo para procesar!</p>
           )}
        </>
      );
    }
    return (
      <>
        <UploadCloud className="h-12 w-12 text-muted-foreground/70 mx-auto mb-4 group-hover:text-primary transition-colors duration-300" />
        <p className="text-muted-foreground font-medium text-lg">
          Arrastra y suelta tu CV aquí
        </p>
        <p className="text-muted-foreground/80">o haz clic para seleccionar</p>
        <p className="text-xs text-muted-foreground/60 mt-3">
          (PDF, DOCX, TXT - Máx. 5MB)
        </p>
      </>
    );
  };

  return (
    <section id="upload-cv" className="py-16 md:py-24 bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="max-w-3xl mx-auto text-center shadow-2xl border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 transform hover:scale-[1.01]">
          <CardHeader className="pb-4">
            <div className="mx-auto bg-primary/10 p-5 rounded-full w-fit mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className="h-16 w-16 text-primary" strokeWidth={1.5} />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold font-heading mb-3 text-foreground">
              Impulsa tu Futuro: <span className="text-primary">Carga tu CV y Crea tu Perfil</span>
            </CardTitle>
            <CardDescription className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
              Nuestra <span className="font-semibold text-primary">inteligencia artificial</span> analizará tu experiencia y creará un perfil profesional <span className="font-semibold text-accent">dinámico y optimizado</span> en minutos. ¡El primer paso hacia nuevas oportunidades está a un clic!
            </CardDescription>
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
              <div className="mt-6 mb-8 p-6 bg-green-50 border border-green-200 rounded-lg text-left">
                <h3 className="text-xl font-semibold text-green-700 mb-2 flex items-center">
                  <LinkIcon className="h-6 w-6 mr-2 text-green-600" />
                  ¡Tu Perfil está Listo!
                </h3>
                <p className="text-green-600 mb-3">
                  Hemos generado tu perfil profesional. Puedes verlo aquí:
                </p>
                <Link href={generatedSiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-medium underline hover:text-primary/80 break-all">
                  {generatedSiteUrl}
                </Link>
                 <Button onClick={() => { setStatus("idle"); setSelectedFile(null); setGeneratedSiteUrl(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="mt-4 w-full md:w-auto">
                  Subir otro CV
                </Button>
              </div>
            )}

            {status === "error" && errorMessage && (
              <div className="mt-6 mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <h3 className="text-lg font-semibold text-red-700 mb-2 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  Error al Procesar
                </h3>
                <p className="text-red-600 text-sm">{errorMessage}</p>
                <Button variant="outline" onClick={handleUploadAndProcess} disabled={!selectedFile} className="mt-4 mr-2">
                  Intentar de Nuevo
                </Button>
                 <Button variant="secondary" onClick={() => { setStatus("idle"); setSelectedFile(null); setErrorMessage(null); if (fileInputRef.current) fileInputRef.current.value = "";}} className="mt-4">
                  Seleccionar otro archivo
                </Button>
              </div>
            )}
            
            {(status === "idle" || status === "fileSelected") && (
              <Button
                size="lg"
                className="py-7 px-10 text-lg rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-full md:w-auto"
                onClick={handleUploadAndProcess}
                disabled={!selectedFile}
              >
                <UploadCloud className="mr-3 h-6 w-6" />
                {selectedFile ? "Crear Perfil con este CV" : "Selecciona un CV primero"}
              </Button>
            )}

            <p className="mt-8 text-xs text-muted-foreground/80">
              Al subir tu CV, aceptas nuestros <Link href="/terminos" className="underline hover:text-primary">Términos de Servicio</Link> y <Link href="/privacidad" className="underline hover:text-primary">Política de Privacidad</Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

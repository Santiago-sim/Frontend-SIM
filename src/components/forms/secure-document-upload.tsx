"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"

interface SecureDocumentUploadProps {
  userId: string
  documentType: "passport" | "visa"
  onUploadSuccess: () => void
  replaceDocumentId?: string
}

export default function SecureDocumentUpload({
  userId,
  documentType,
  onUploadSuccess,
  replaceDocumentId,
}: SecureDocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsUploading(true)
    setUploadStatus({ type: null, message: "" })

    const formData = new FormData(event.currentTarget)

    // Asegurar que los valores se envíen correctamente
    formData.set("userId", userId)
    formData.set("documentType", documentType)

    // Solo agregar replaceDocumentId si existe
    if (replaceDocumentId) {
      formData.set("replaceDocumentId", replaceDocumentId)
    }

    console.log("Sending form data:", {
      userId,
      documentType,
      replaceDocumentId,
      hasFile: !!formData.get("file"),
    })

    try {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setUploadStatus({
          type: "success",
          message: result.message || "Documento subido exitosamente",
        })
        // Limpiar el formulario de manera segura
        if (formRef.current) {
          formRef.current.reset()
        }
        onUploadSuccess()
      } else {
        setUploadStatus({
          type: "error",
          message: result.error || "Error al subir el documento",
        })
      }
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus({
        type: "error",
        message: "Error de conexión. Por favor, intenta de nuevo.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const documentLabel = documentType === "passport" ? "Pasaporte" : "Visa"

  return (
    <div className="space-y-4">
      {uploadStatus.type && (
        <Alert
          className={
            uploadStatus.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }
        >
          {uploadStatus.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{uploadStatus.message}</AlertDescription>
        </Alert>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file" className="text-sm font-medium">
            {replaceDocumentId ? `Reemplazar ${documentLabel}` : `Subir ${documentLabel}`}
          </Label>
          <Input
            id="file"
            name="file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            required
            disabled={isUploading}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500">Formatos permitidos: PDF, JPG, PNG. Tamaño máximo: 5MB</p>
        </div>

        <Button type="submit" disabled={isUploading} className="w-full">
          {isUploading ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-spin" />
              Subiendo...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              {replaceDocumentId ? "Reemplazar" : "Subir"} {documentLabel}
            </>
          )}
        </Button>
      </form>
    </div>
  )
}

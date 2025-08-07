"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { FileCheck2, FileX, Check, AlertCircle, RefreshCw, Trash2, Shield } from "lucide-react"
import SecureDocumentUpload from "@/components/forms/secure-document-upload"
import DocumentViewer from "@/components/document-viewer"

interface Document {
  id: number
  type: "passport" | "visa"
  name: string
  status: "pending" | "approved" | "rejected"
  cloudinary_public_id?: string
  strapi_url?: string
  file_name?: string
  upload_date?: string
}

interface UserDocuments {
  passport_document?: Document
  visa_document?: Document
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<UserDocuments>({})
  const [userId, setUserId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDocuments = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/user/documents", {
        cache: "no-store",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al cargar documentos")
      }

      const data = await response.json()
      console.log("Documents loaded:", data)

      setUserId(data.userId)
      setDocuments(data.documents || {})
    } catch (error) {
      console.error("Error loading documents:", error)
      setError(error instanceof Error ? error.message : "Error desconocido")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            Aprobado
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <FileX className="h-3 w-3 mr-1" />
            Rechazado
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        )
    }
  }

  const handleUploadSuccess = () => {
    loadDocuments()
  }

  const handleDeleteDocument = async (documentType: "passport" | "visa") => {
    if (!confirm("¿Estás seguro de que quieres eliminar este documento?")) {
      return
    }

    try {
      const response = await fetch("/api/documents/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentType,
          userId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        loadDocuments()
      } else {
        setError(result.error || "Error al eliminar documento")
      }
    } catch (error) {
      console.error("Error deleting document:", error)
      setError("Error al eliminar documento")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-gray-800 flex items-center gap-2">
          <FileCheck2 className="h-5 w-5 text-blue-500" />
          Mis Documentos
        </h1>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Shield className="h-4 w-4" />
          <span>Almacenamiento Seguro</span>
        </div>
      </div>

      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex-1">{error}</AlertDescription>
          <Button variant="outline" size="sm" className="ml-2 bg-transparent" onClick={loadDocuments}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Reintentar
          </Button>
        </Alert>
      )}

      {!documents.passport_document && !documents.visa_document && (
        <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No tienes documentos subidos. Por favor, sube los documentos requeridos para completar tu perfil.
            <br />
            <small className="text-blue-600">
              <Shield className="h-3 w-3 inline mr-1" />
              Tus documentos se almacenan de forma segura y privada.
            </small>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Pasaporte */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <CardTitle className="text-lg">Pasaporte</CardTitle>
              {documents.passport_document && getStatusBadge(documents.passport_document.status)}
            </div>
          </CardHeader>
          <CardContent>
            {documents.passport_document ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{documents.passport_document.file_name}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(documents.passport_document.upload_date!).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Indicador de seguridad */}
                  <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                    <Shield className="h-3 w-3" />
                    <span>Almacenado de forma segura</span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    {documents.passport_document.strapi_url ? (
                      <DocumentViewer strapiUrl={documents.passport_document.strapi_url} documentName="Pasaporte" />
                    ) : (
                      <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          No se puede visualizar: URL no disponible
                        </AlertDescription>
                      </Alert>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDocument("passport")}
                      className="text-red-500 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>

                {/* Opción para reemplazar */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Reemplazar documento</h4>
                  <SecureDocumentUpload
                    userId={userId}
                    documentType="passport"
                    onUploadSuccess={handleUploadSuccess}
                    replaceDocumentId={documents.passport_document.id.toString()}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">Por favor, sube una copia de tu pasaporte vigente.</p>
                <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                  <Shield className="h-4 w-4" />
                  <span>Se almacenará de forma segura y privada</span>
                </div>
                <SecureDocumentUpload userId={userId} documentType="passport" onUploadSuccess={handleUploadSuccess} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visa */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <CardTitle className="text-lg">Visa</CardTitle>
              {documents.visa_document && getStatusBadge(documents.visa_document.status)}
            </div>
          </CardHeader>
          <CardContent>
            {documents.visa_document ? (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{documents.visa_document.file_name}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(documents.visa_document.upload_date!).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Indicador de seguridad */}
                  <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                    <Shield className="h-3 w-3" />
                    <span>Almacenado de forma segura</span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    {documents.visa_document.strapi_url ? (
                      <DocumentViewer strapiUrl={documents.visa_document.strapi_url} documentName="Visa" />
                    ) : (
                      <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          No se puede visualizar: URL no disponible
                        </AlertDescription>
                      </Alert>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDocument("visa")}
                      className="text-red-500 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>

                {/* Opción para reemplazar */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Reemplazar documento</h4>
                  <SecureDocumentUpload
                    userId={userId}
                    documentType="visa"
                    onUploadSuccess={handleUploadSuccess}
                    replaceDocumentId={documents.visa_document.id.toString()}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">Por favor, sube una copia de tu visa vigente.</p>
                <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                  <Shield className="h-4 w-4" />
                  <span>Se almacenará de forma segura y privada</span>
                </div>
                <SecureDocumentUpload userId={userId} documentType="visa" onUploadSuccess={handleUploadSuccess} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

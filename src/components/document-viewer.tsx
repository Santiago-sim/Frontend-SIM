"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface DocumentViewerProps {
  strapiUrl: string
  documentName: string
}

export default function DocumentViewer({ strapiUrl, documentName }: DocumentViewerProps) {
  const handleViewDocument = () => {
    // Abrir la URL simple de Strapi en nueva ventana
    window.open(strapiUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <Button variant="outline" size="sm" onClick={handleViewDocument} className="w-full bg-transparent">
      <ExternalLink className="h-4 w-4 mr-2" />
      Ver {documentName}
    </Button>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { XCircle, Save, Trash2, Undo, RefreshCw, Send } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSignedContractPreview } from "@/app/data/services-reserva/update-reserva"

interface ContractSignerProps {
  contractUrl: string
  onContractSigned: (signedFile: File, previewUrl: string) => void
  onCancel: () => void
}

export default function ContractSigner({ contractUrl, onContractSigned, onCancel }: ContractSignerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPdfLoaded, setIsPdfLoaded] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [strokeColor, setStrokeColor] = useState("#000000")
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [activeTab, setActiveTab] = useState("draw")
  const [typedSignature, setTypedSignature] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
  const [signedContractPreview, setSignedContractPreview] = useState<string | null>(null)
  const [signedFile, setSignedFile] = useState<File | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const typedSignatureCanvasRef = useRef<HTMLCanvasElement>(null)

  // Load PDF and prepare canvas
  useEffect(() => {
    const loadPdf = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // In a real implementation, you would:
        // 1. Fetch the PDF
        // 2. Render it to a canvas using PDF.js
        // For this example, we'll simulate PDF loading

        setTimeout(() => {
          setIsPdfLoaded(true)
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        setError("Error al cargar el contrato")
        setIsLoading(false)
        console.error(err)
      }
    }

    loadPdf()
  }, [contractUrl])

  // Initialize signature canvas
  useEffect(() => {
    if (!signatureCanvasRef.current) return

    const canvas = signatureCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Set initial canvas state
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = strokeWidth
    ctx.strokeStyle = strokeColor
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }, [strokeColor, strokeWidth])

  // Initialize typed signature canvas
  useEffect(() => {
    if (!typedSignatureCanvasRef.current) return

    const canvas = typedSignatureCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Set initial canvas state
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  // Handle mouse events for drawing signature
  useEffect(() => {
    if (!signatureCanvasRef.current) return

    const canvas = signatureCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let lastX = 0
    let lastY = 0

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      setIsDrawing(true)
      const rect = canvas.getBoundingClientRect()

      if (e instanceof MouseEvent) {
        lastX = e.clientX - rect.left
        lastY = e.clientY - rect.top
      } else {
        // Touch event
        lastX = e.touches[0].clientX - rect.left
        lastY = e.touches[0].clientY - rect.top
      }

      // Start a new path for this stroke
      ctx.beginPath()
      ctx.moveTo(lastX, lastY)
    }

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return

      const rect = canvas.getBoundingClientRect()
      let x, y

      if (e instanceof MouseEvent) {
        x = e.clientX - rect.left
        y = e.clientY - rect.top
      } else {
        // Touch event
        x = e.touches[0].clientX - rect.left
        y = e.touches[0].clientY - rect.top
        // Prevent scrolling while drawing
        e.preventDefault()
      }

      ctx.lineWidth = strokeWidth
      ctx.strokeStyle = strokeColor

      ctx.lineTo(x, y)
      ctx.stroke()

      lastX = x
      lastY = y
      setHasSignature(true)
    }

    const stopDrawing = () => {
      if (isDrawing) {
        ctx.closePath()
        setIsDrawing(false)
        generatePreview()
      }
    }

    // Mouse events
    canvas.addEventListener("mousedown", startDrawing)
    canvas.addEventListener("mousemove", draw as any)
    canvas.addEventListener("mouseup", stopDrawing)
    canvas.addEventListener("mouseout", stopDrawing)

    // Touch events
    canvas.addEventListener("touchstart", startDrawing)
    canvas.addEventListener("touchmove", draw as any)
    canvas.addEventListener("touchend", stopDrawing)

    return () => {
      // Mouse events
      canvas.removeEventListener("mousedown", startDrawing)
      canvas.removeEventListener("mousemove", draw as any)
      canvas.removeEventListener("mouseup", stopDrawing)
      canvas.removeEventListener("mouseout", stopDrawing)

      // Touch events
      canvas.removeEventListener("touchstart", startDrawing)
      canvas.removeEventListener("touchmove", draw as any)
      canvas.removeEventListener("touchend", stopDrawing)
    }
  }, [isDrawing, strokeColor, strokeWidth])

  // Handle typed signature
  useEffect(() => {
    if (!typedSignatureCanvasRef.current || !typedSignature) return

    const canvas = typedSignatureCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw typed signature
    ctx.font = "italic 28px 'Brush Script MT', cursive"
    ctx.fillStyle = strokeColor
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(typedSignature, canvas.width / 2, canvas.height / 2)

    setHasSignature(!!typedSignature)
    generatePreview()
  }, [typedSignature, strokeColor])

  const clearSignature = () => {
    if (activeTab === "draw" && signatureCanvasRef.current) {
      const canvas = signatureCanvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      setHasSignature(false)
      setPreviewImage(null)
    } else if (activeTab === "type") {
      setTypedSignature("")
      setHasSignature(false)
      setPreviewImage(null)
    }

    // Limpiar la vista previa del contrato firmado
    setSignedContractPreview(null)
    setSignedFile(null)
  }

  const generatePreview = () => {
    const canvas = activeTab === "draw" ? signatureCanvasRef.current : typedSignatureCanvasRef.current
    if (!canvas) return

    // Generate a preview image
    const dataUrl = canvas.toDataURL("image/png")
    setPreviewImage(dataUrl)
  }

  const applySignatureToPdf = async () => {
    if (!hasSignature) {
      setError("Por favor, dibuja o escribe tu firma antes de continuar")
      return
    }

    try {
      setIsGeneratingPreview(true)

      // Get the active canvas
      const canvas = activeTab === "draw" ? signatureCanvasRef.current : typedSignatureCanvasRef.current
      if (!canvas) return

      // Get signature as image
      const signatureDataUrl = canvas.toDataURL("image/png")

      // Convert data URL to Blob
      const response = await fetch(signatureDataUrl)
      const blob = await response.blob()

      // Create a File from the Blob
      const file = new File([blob], "signed-contract.pdf", { type: "application/pdf" })

      // Guardar el archivo firmado para usarlo después
      setSignedFile(file)

      // Generar una vista previa del contrato firmado
      const previewUrl = await getSignedContractPreview(contractUrl, signatureDataUrl)
      setSignedContractPreview(previewUrl)

      setIsGeneratingPreview(false)
    } catch (err) {
      setError("Error al aplicar la firma al contrato")
      setIsGeneratingPreview(false)
      console.error(err)
    }
  }

  const handleSubmitSignedContract = () => {
    if (!signedFile || !signedContractPreview) {
      setError("No se ha generado el contrato firmado")
      return
    }

    // Llamar al callback con el archivo firmado y la URL de vista previa
    onContractSigned(signedFile, signedContractPreview)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando contrato...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4" ref={containerRef}>
      {error && (
        <Alert className="bg-red-50 border-red-200 text-red-800">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {signedContractPreview ? (
        // Mostrar vista previa del contrato firmado
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-md mb-4">
            <h4 className="font-medium text-green-700 mb-2">Contrato firmado correctamente</h4>
            <p className="text-gray-600 mb-3">
              Has firmado el contrato. Ahora puedes revisarlo y enviarlo para completar tu reserva.
            </p>
          </div>

          <div className="aspect-[3/4] w-full bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border mb-6">
            <iframe
              src={signedContractPreview}
              className="w-full h-full"
              title="Contrato firmado"
              style={{ minHeight: "500px" }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={clearSignature}
              className="text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Descartar firma
            </Button>

            <Button
              className="bg-blue-500 hover:bg-blue-600 ml-auto cursor-pointer"
              onClick={handleSubmitSignedContract}
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar contrato firmado
            </Button>
          </div>
        </div>
      ) : (
        // Mostrar interfaz de firma
        <>
          <div className="aspect-[3/4] w-full bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border mb-6">
            {isPdfLoaded ? (
              <iframe
                src={contractUrl}
                className="w-full h-full"
                title="Contrato para firmar"
                style={{ minHeight: "400px" }}
              />
            ) : (
              <div className="text-center p-4">
                <XCircle className="h-12 w-12 mx-auto text-red-500 mb-2" />
                <p className="text-gray-700">No se pudo cargar el contrato</p>
              </div>
            )}
          </div>

          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Tu firma</h3>

              {previewImage && (
                <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
                  <p className="text-sm text-gray-600">Vista previa:</p>
                  <img
                    src={previewImage || "/placeholder.svg"}
                    alt="Vista previa de firma"
                    className="h-10 border rounded"
                  />
                </div>
              )}
            </div>

            <Tabs defaultValue="draw" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="draw" className="cursor-pointer">
                  Dibujar firma
                </TabsTrigger>
                <TabsTrigger value="type" className="cursor-pointer">
                  Escribir firma
                </TabsTrigger>
              </TabsList>

              <TabsContent value="draw" className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <label htmlFor="stroke-color" className="text-sm text-gray-600">
                      Color:
                    </label>
                    <input
                      type="color"
                      id="stroke-color"
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="w-8 h-8 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label htmlFor="stroke-width" className="text-sm text-gray-600">
                      Grosor:
                    </label>
                    <input
                      type="range"
                      id="stroke-width"
                      min="1"
                      max="5"
                      value={strokeWidth}
                      onChange={(e) => setStrokeWidth(Number(e.target.value))}
                      className="w-24 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="bg-white border-2 border-dashed border-gray-300 rounded-md p-2 mb-4 relative">
                  <canvas
                    ref={signatureCanvasRef}
                    className="w-full h-32 cursor-crosshair touch-none"
                    style={{ backgroundColor: "white" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                    <p className="text-gray-400 text-lg italic">Dibuja tu firma aquí</p>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 text-center">
                    Haz clic y arrastra para dibujar tu firma
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="type" className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="typed-signature" className="text-sm text-gray-600">
                    Escribe tu nombre completo:
                  </label>
                  <input
                    type="text"
                    id="typed-signature"
                    value={typedSignature}
                    onChange={(e) => setTypedSignature(e.target.value)}
                    placeholder="Escribe tu firma aquí"
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="bg-white border-2 border-dashed border-gray-300 rounded-md p-2 mb-4">
                  <canvas ref={typedSignatureCanvasRef} className="w-full h-32" style={{ backgroundColor: "white" }} />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant="outline"
                onClick={clearSignature}
                className="text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
                disabled={!hasSignature || isGeneratingPreview}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Borrar firma
              </Button>

              <Button
                variant="outline"
                onClick={onCancel}
                className="text-gray-600 border-gray-200 hover:bg-gray-50 cursor-pointer"
                disabled={isGeneratingPreview}
              >
                <Undo className="h-4 w-4 mr-2" />
                Cancelar
              </Button>

              <Button
                className="bg-blue-500 hover:bg-blue-600 ml-auto cursor-pointer"
                onClick={applySignatureToPdf}
                disabled={!hasSignature || isGeneratingPreview}
              >
                {isGeneratingPreview ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Aplicar firma
                  </>
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff, Check, AlertCircle } from "lucide-react"

export default function PasswordPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<null | "success" | "error">(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setStatus("success")

      // Reset form
      const form = e.target as HTMLFormElement
      form.reset()
    }, 1500)
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h1 className="text-xl font-medium text-gray-800 mb-6 flex items-center gap-2">
        <Lock className="h-5 w-5 text-blue-500" />
        Cambiar Contraseña
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        {/* Current Password */}
        <div className="space-y-2">
          <Label htmlFor="currentPassword" className="font-medium text-gray-700">
            Contraseña Actual
          </Label>
          <div className="relative">
            <Input
              id="currentPassword"
              name="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              className="bg-blue-50 border-blue-200 pr-10"
              placeholder="Ingresa tu contraseña actual"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="newPassword" className="font-medium text-gray-700">
            Nueva Contraseña
          </Label>
          <div className="relative">
            <Input
              id="newPassword"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              className="bg-blue-50 border-blue-200 pr-10"
              placeholder="Ingresa tu nueva contraseña"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, un número y un carácter
            especial.
          </p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="font-medium text-gray-700">
            Confirmar Contraseña
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className="bg-blue-50 border-blue-200 pr-10"
              placeholder="Confirma tu nueva contraseña"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {status === "success" && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center gap-2">
            <Check className="h-5 w-5" />
            Tu contraseña ha sido actualizada exitosamente.
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Ha ocurrido un error. Por favor, verifica tu contraseña actual e intenta nuevamente.
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6"
          >
            {isSubmitting ? "Actualizando..." : "Actualizar Contraseña"}
          </Button>
        </div>
      </form>
    </div>
  )
}


"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, X, AlertCircle } from "lucide-react"
import { validateNIT } from "@/lib/nit-validator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NITInputProps {
  value: string
  onChange: (value: string, isValid: boolean) => void
  className?: string
  showValidation?: boolean
}

export function NITInput({ value, onChange, className = "", showValidation = true }: NITInputProps) {
  const [inputValue, setInputValue] = useState(value)
  const [touched, setTouched] = useState(false)
  const [validation, setValidation] = useState<{
    isValid: boolean
    errorMessage: string
    formattedNIT?: string
    baseNIT?: string
    checkDigit?: number
  }>({ isValid: false, errorMessage: "" })
  const [showSuggestion, setShowSuggestion] = useState(false)

  // Validar el NIT cuando cambia el valor
  useEffect(() => {
    if (inputValue) {
      const result = validateNIT(inputValue)
      setValidation(result)
      onChange(inputValue, result.isValid)

      // Mostrar sugerencia si el NIT es inválido pero tenemos una sugerencia
      setShowSuggestion(
        !result.isValid && !!result.formattedNIT && result.errorMessage.includes("dígito de verificación"),
      )
    } else {
      setValidation({ isValid: false, errorMessage: "Este campo es obligatorio" })
      onChange("", false)
      setShowSuggestion(false)
    }
  }, [inputValue, onChange])

  // Manejar cambios en el input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setTouched(true)
  }

  // Aplicar sugerencia
  const applySuggestion = () => {
    if (validation.formattedNIT) {
      setInputValue(validation.formattedNIT)
      setShowSuggestion(false)
    }
  }

  // Renderizar indicador de validación
  const renderValidationIndicator = () => {
    if (!touched || !showValidation) return null

    if (validation.isValid) {
      return <Check className="h-5 w-5 text-green-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
    } else {
      return <X className="h-5 w-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="nitEmpresa">NIT empresa</Label>
      <div className="relative">
        <Input
          id="nitEmpresa"
          placeholder="Ej: 900123456-1"
          value={inputValue}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          className={`pr-10 ${
            touched && !validation.isValid ? "border-red-500 focus-visible:ring-red-500" : ""
          } ${className}`}
        />
        {renderValidationIndicator()}

        {touched && validation.errorMessage && !validation.isValid && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{validation.errorMessage}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {touched && !validation.isValid && <p className="text-sm text-red-500">{validation.errorMessage}</p>}

      {showSuggestion && validation.formattedNIT && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800 mb-2">
            ¿Quisiste decir <strong>{validation.formattedNIT}</strong>?
          </p>
          <button
            type="button"
            onClick={applySuggestion}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
          >
            Usar este NIT
          </button>
        </div>
      )}

      <div className="text-xs text-gray-500 mt-1">Formato: XXXXXXXXX-Y donde Y es el dígito de verificación</div>
    </div>
  )
}

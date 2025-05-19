/**
 * Funciones para validar el NIT colombiano
 */

/**
 * Calcula el dígito de verificación para un NIT colombiano
 * @param nit El NIT sin el dígito de verificación
 * @returns El dígito de verificación calculado
 */
export function calculateNITCheckDigit(nit: string): number {
  // Eliminar cualquier caracter que no sea un número
  const cleanNIT = nit.replace(/\D/g, "")

  if (cleanNIT.length < 1) return -1

  // Factores de multiplicación según la DIAN
  const factors = [41, 37, 29, 23, 19, 17, 13, 7, 3]

  // Asegurarse de que usamos solo los dígitos necesarios (máximo 9)
  const digits = cleanNIT.slice(-9).padStart(9, "0")

  // Calcular la suma ponderada
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(digits.charAt(i)) * factors[i]
  }

  // Calcular el módulo 11
  const mod = sum % 11

  // Determinar el dígito de verificación
  return mod > 1 ? 11 - mod : mod
}

/**
 * Valida un NIT colombiano completo (con dígito de verificación)
 * @param fullNIT El NIT completo, puede incluir guiones o espacios
 * @returns Un objeto con el resultado de la validación
 */
export function validateNIT(fullNIT: string): {
  isValid: boolean
  errorMessage: string
  formattedNIT?: string
  baseNIT?: string
  checkDigit?: number
} {
  // Eliminar espacios, guiones y otros caracteres no numéricos
  const cleanNIT = fullNIT.replace(/\D/g, "")

  // Verificar longitud mínima (al menos 2 dígitos: 1 para el NIT base y 1 para el DV)
  if (cleanNIT.length < 2) {
    return {
      isValid: false,
      errorMessage: "El NIT debe tener al menos 2 dígitos",
    }
  }

  // Verificar longitud máxima (máximo 10 dígitos: 9 para el NIT base y 1 para el DV)
  if (cleanNIT.length > 10) {
    return {
      isValid: false,
      errorMessage: "El NIT no puede tener más de 10 dígitos",
    }
  }

  // Extraer el NIT base y el dígito de verificación
  const baseNIT = cleanNIT.slice(0, -1)
  const providedCheckDigit = Number.parseInt(cleanNIT.slice(-1))

  // Calcular el dígito de verificación correcto
  const calculatedCheckDigit = calculateNITCheckDigit(baseNIT)

  // Verificar si el dígito de verificación es correcto
  if (providedCheckDigit !== calculatedCheckDigit) {
    return {
      isValid: false,
      errorMessage: `El dígito de verificación es incorrecto. Debería ser ${calculatedCheckDigit}`,
      baseNIT,
      checkDigit: calculatedCheckDigit,
      formattedNIT: `${baseNIT}-${calculatedCheckDigit}`,
    }
  }

  // NIT válido
  return {
    isValid: true,
    errorMessage: "",
    baseNIT,
    checkDigit: providedCheckDigit,
    formattedNIT: `${baseNIT}-${providedCheckDigit}`,
  }
}

/**
 * Formatea un NIT para su visualización
 * @param nit El NIT a formatear, puede incluir o no el dígito de verificación
 * @param includeCheckDigit Si es true, calcula y añade el dígito de verificación
 * @returns El NIT formateado
 */
export function formatNIT(nit: string, includeCheckDigit = false): string {
  // Eliminar cualquier caracter que no sea un número
  const cleanNIT = nit.replace(/\D/g, "")

  if (cleanNIT.length === 0) return ""

  if (includeCheckDigit) {
    // Si el NIT ya incluye el dígito de verificación, lo extraemos
    if (cleanNIT.length > 1) {
      const baseNIT = cleanNIT.slice(0, -1)
      const checkDigit = calculateNITCheckDigit(baseNIT)
      return `${baseNIT}-${checkDigit}`
    } else {
      // Si solo hay un dígito, calculamos el DV para ese único dígito
      const checkDigit = calculateNITCheckDigit(cleanNIT)
      return `${cleanNIT}-${checkDigit}`
    }
  } else {
    // Si no queremos incluir el dígito de verificación, solo formateamos el NIT base
    return cleanNIT
  }
}

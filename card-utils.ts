// Detectar el tipo de tarjeta basado en el número
export function detectCardType(cardNumber: string): string {
  const cleanNumber = cardNumber.replace(/\D/g, "")

  if (cleanNumber.startsWith("4")) {
    return "visa"
  } else if (/^5[1-5]/.test(cleanNumber)) {
    return "mastercard"
  } else if (/^3[47]/.test(cleanNumber)) {
    return "amex"
  } else if (/^6(?:011|5)/.test(cleanNumber)) {
    return "discover"
  } else {
    return "unknown"
  }
}

// Formatear el número de tarjeta con espacios
export function formatCardNumber(value: string): string {
  if (!value) return ""

  // Eliminar espacios existentes
  const digits = value.replace(/\s/g, "")

  // Aplicar formato según el tipo de tarjeta
  if (/^3[47]/.test(digits)) {
    // Formato AMEX: XXXX XXXXXX XXXXX
    return digits.replace(/^(\d{4})(\d{0,6})(\d{0,5})$/, (match, p1, p2, p3) => {
      let result = p1
      if (p2) result += " " + p2
      if (p3) result += " " + p3
      return result
    })
  } else {
    // Formato estándar: XXXX XXXX XXXX XXXX
    return digits.replace(/^(\d{4})(\d{0,4})(\d{0,4})(\d{0,4})$/, (match, p1, p2, p3, p4) => {
      let result = p1
      if (p2) result += " " + p2
      if (p3) result += " " + p3
      if (p4) result += " " + p4
      return result
    })
  }
}

// Formatear la fecha de expiración
export function formatExpiryDate(value: string): string {
  if (!value) return ""

  if (value.length <= 2) {
    return value
  }

  // Separar mes y año con una barra
  return value.substring(0, 2) + "/" + value.substring(2)
}

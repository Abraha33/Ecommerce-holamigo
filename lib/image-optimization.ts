// Función para determinar el formato de imagen óptimo basado en el soporte del navegador
export function getOptimalImageFormat(userAgent: string): "webp" | "avif" | "jpeg" {
  // Detectar soporte para AVIF
  if (userAgent.includes("Chrome") && Number.parseInt(userAgent.split("Chrome/")[1]) >= 85) {
    return "avif"
  }

  // Detectar soporte para WebP
  if (
    userAgent.includes("Chrome") ||
    userAgent.includes("Opera") ||
    (userAgent.includes("Firefox") && Number.parseInt(userAgent.split("Firefox/")[1]) >= 65)
  ) {
    return "webp"
  }

  // Fallback a JPEG para otros navegadores
  return "jpeg"
}

// Función para calcular tamaños responsivos de imágenes
export function getResponsiveImageSizes(containerWidth: "full" | "half" | "third" | "quarter"): string {
  switch (containerWidth) {
    case "full":
      return "(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
    case "half":
      return "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, 50vw"
    case "third":
      return "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 33vw"
    case "quarter":
      return "(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 25vw"
    default:
      return "100vw"
  }
}

// Función para generar placeholders de baja resolución
export function generateBlurDataURL(width: number, height: number, color?: string): string {
  const svg = `
    <svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color || "#e2e8f0"}"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`
}

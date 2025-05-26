// Utilidades para mejorar el rendimiento

// Función para detectar si estamos en un dispositivo móvil
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// Función para detectar la conexión lenta
export function isSlowConnection(): boolean {
  if (typeof navigator === "undefined" || !("connection" in navigator)) return false

  // @ts-ignore - Connection API no está en todos los navegadores
  const connection = navigator.connection

  if (!connection) return false

  // Detectar conexiones 2G o conexiones con ahorro de datos activado
  return (
    // @ts-ignore
    connection.effectiveType === "2g" ||
    // @ts-ignore
    connection.saveData === true
  )
}

// Función para cargar recursos de forma diferida
export function loadDeferredResources() {
  // Esperar a que la página esté completamente cargada
  if (typeof window !== "undefined") {
    window.addEventListener("load", () => {
      // Esperar un poco más para asegurarnos de que los recursos críticos ya se cargaron
      setTimeout(() => {
        // Cargar scripts no críticos
        const deferredScripts = document.querySelectorAll('script[data-defer="true"]')
        deferredScripts.forEach((script) => {
          const newScript = document.createElement("script")

          // Copiar todos los atributos excepto data-defer
          Array.from(script.attributes).forEach((attr) => {
            if (attr.name !== "data-defer") {
              newScript.setAttribute(attr.name, attr.value)
            }
          })

          // Reemplazar el script original
          script.parentNode?.replaceChild(newScript, script)
        })

        // Cargar estilos no críticos
        const deferredStyles = document.querySelectorAll('link[data-defer="true"]')
        deferredStyles.forEach((link) => {
          link.setAttribute("rel", "stylesheet")
        })
      }, 1000)
    })
  }
}

// Función para precargar recursos críticos
export function preloadCriticalResources(resources: string[]) {
  if (typeof document === "undefined") return

  resources.forEach((resource) => {
    const link = document.createElement("link")
    link.rel = "preload"

    // Determinar el tipo de recurso
    if (resource.endsWith(".js")) {
      link.as = "script"
    } else if (resource.endsWith(".css")) {
      link.as = "style"
    } else if (/\.(png|jpe?g|gif|svg|webp)$/i.test(resource)) {
      link.as = "image"
    } else if (/\.(woff2?|ttf|otf|eot)$/i.test(resource)) {
      link.as = "font"
      link.crossOrigin = "anonymous"
    }

    link.href = resource
    document.head.appendChild(link)
  })
}

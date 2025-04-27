import { Phone } from "lucide-react"

export function WhatsAppSupport() {
  return (
    <div className="p-4 bg-green-50 border-t border-green-100">
      <div className="flex items-center gap-3">
        <div className="bg-green-500 text-white p-2 rounded-full">
          <Phone className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-medium text-sm">¿Necesitas ayuda para completar tu pedido?</h3>
          <a
            href="https://wa.me/573183741959"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#004a93] hover:underline text-sm"
          >
            Contáctanos por WhatsApp: +57 318 374 1959
          </a>
        </div>
      </div>
    </div>
  )
}

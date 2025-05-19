"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Mail, ArrowRight, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface EmailVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
}

export default function EmailVerificationModal({ isOpen, onClose, email }: EmailVerificationModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSending, setIsSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [countdown, setCountdown] = useState(3)

  // Simulate sending verification email
  useEffect(() => {
    if (isOpen && !emailSent) {
      setIsSending(true)

      // Simulate API call to send verification email
      const timer = setTimeout(() => {
        setIsSending(false)
        setEmailSent(true)

        toast({
          title: "Correo enviado",
          description: "Hemos enviado un código de verificación a tu correo electrónico.",
          variant: "default",
        })
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, emailSent, toast])

  // Countdown timer for auto-redirect
  useEffect(() => {
    if (emailSent && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (emailSent && countdown === 0) {
      router.push(`/verify-email?email=${encodeURIComponent(email)}`)
    }
  }, [emailSent, countdown, router, email])

  // Handle manual redirect
  const handleRedirect = () => {
    router.push(`/verify-email?email=${encodeURIComponent(email)}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Verifica tu correo electrónico</DialogTitle>
          <DialogDescription className="text-center">
            Para completar tu registro, necesitamos verificar tu correo electrónico.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-ecoplast-blue" />
          </div>

          <AnimatePresence mode="wait">
            {isSending ? (
              <motion.div
                key="sending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <p className="text-lg font-medium mb-2">Enviando correo de verificación</p>
                <p className="text-gray-600 mb-4">Estamos enviando un código de verificación a:</p>
                <p className="font-medium text-ecoplast-blue mb-4">{email}</p>
                <div className="flex justify-center">
                  <div className="w-8 h-8">
                    <svg className="animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="sent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <p className="text-lg font-medium mb-2">¡Correo enviado!</p>
                <p className="text-gray-600 mb-2">Hemos enviado un código de verificación a:</p>
                <p className="font-medium text-ecoplast-blue mb-4">{email}</p>
                <p className="text-sm text-gray-600">
                  Por favor, revisa tu bandeja de entrada y sigue las instrucciones para verificar tu cuenta.
                </p>

                {emailSent && <p className="text-sm text-gray-500 mt-4">Serás redirigido en {countdown} segundos...</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter>
          <Button
            className="w-full bg-ecoplast-blue hover:bg-blue-700 flex items-center justify-center gap-2"
            onClick={handleRedirect}
            disabled={isSending}
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <span>Continuar</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

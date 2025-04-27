"use client"

import { useLoading } from "@/contexts/loading-context"
import { Loader } from "@/components/ui/loader"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface LoadingOverlayProps {
  className?: string
}

export function LoadingOverlay({ className }: LoadingOverlayProps) {
  const { isLoading, loadingMessage } = useLoading()

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm",
            className,
          )}
        >
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 flex flex-col items-center">
            <Loader size="large" className="mb-4" />
            <p className="text-[#20509E] font-medium text-center">{loadingMessage || "Cargando..."}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  darkMode?: boolean
  className?: string
}

export function SearchBar({ placeholder = "Buscar productos...", darkMode = false, className }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <form onSubmit={handleSearch} className={cn("flex items-center w-full relative", className)}>
      <div className="relative flex-1">
        <Input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "pr-8 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
            darkMode
              ? "bg-transparent text-white placeholder:text-gray-300"
              : "bg-white text-gray-800 placeholder:text-gray-500",
          )}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className={cn("absolute right-2 top-1/2 -translate-y-1/2", darkMode ? "text-gray-300" : "text-gray-500")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  )
}

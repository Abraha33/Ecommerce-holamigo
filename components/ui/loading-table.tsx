"use client"

import type React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader } from "@/components/ui/loader"
import { cn } from "@/lib/utils"

interface LoadingTableProps {
  className?: string
  isLoading: boolean
  loadingMessage?: string
  columns: string[]
  skeletonRows?: number
  children: React.ReactNode
}

export function LoadingTable({
  className,
  isLoading,
  loadingMessage,
  columns,
  skeletonRows = 5,
  children,
}: LoadingTableProps) {
  return (
    <div className={cn("relative", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : children}
        </TableBody>
      </Table>

      {isLoading && loadingMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px] z-10">
          <div className="flex flex-col items-center">
            <Loader size="medium" color="primary" />
            <p className="mt-2 text-sm font-medium text-[#20509E]">{loadingMessage}</p>
          </div>
        </div>
      )}
    </div>
  )
}

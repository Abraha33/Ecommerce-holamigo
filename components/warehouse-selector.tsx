"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Warehouse {
  id: string
  name: string
  printerCount: number
}

interface WarehouseSelectorProps {
  warehouses: Warehouse[]
  selectedWarehouseId: string
  onWarehouseSelect: (warehouseId: string) => void
}

export function WarehouseSelector({ warehouses, selectedWarehouseId, onWarehouseSelect }: WarehouseSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="h-5 w-5 mr-2" />
          Almacenes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2">
          {warehouses.map((warehouse) => (
            <Button
              key={warehouse.id}
              variant={selectedWarehouseId === warehouse.id ? "default" : "outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                selectedWarehouseId === warehouse.id ? "bg-primary text-primary-foreground" : "",
              )}
              onClick={() => onWarehouseSelect(warehouse.id)}
            >
              <div className="flex flex-col items-start">
                <span>{warehouse.name}</span>
                <span className="text-xs opacity-70">{warehouse.printerCount} impresoras</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

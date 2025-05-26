"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CategorySidebarProps {
  categories: {
    id: string
    name: string
  }[]
  activeCategory: string | null
  onCategoryClick: (categoryId: string | null) => void
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ categories, activeCategory, onCategoryClick }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="relative">
      <Button variant="outline" onClick={toggleSidebar} className="md:hidden">
        {isSidebarOpen ? "Close Categories" : "Open Categories"}
      </Button>

      <div
        className={cn(
          "hidden md:block fixed top-0 left-0 h-full w-64 bg-gray-100 border-r border-gray-200 py-4 px-6 overflow-y-auto",
          isSidebarOpen ? "block" : "hidden md:block",
        )}
      >
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <ul>
          <li key="all">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              className="w-full justify-start mb-2"
              onClick={() => onCategoryClick(null)}
            >
              All
            </Button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Button
                variant={activeCategory === category.id ? "default" : "outline"}
                className="w-full justify-start mb-2"
                onClick={() => onCategoryClick(category.id)}
              >
                {category.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CategorySidebar

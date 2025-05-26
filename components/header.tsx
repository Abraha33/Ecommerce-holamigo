"use client"

import type React from "react"
import { Button } from "@/components/ui/button"

const Header: React.FC = () => {
  // Mock useUser for now to avoid Auth0 issues
  const useUser = () => ({
    user: null,
    isLoading: false,
    error: null,
  })

  const { user, isLoading, error } = useUser()

  return (
    <header className="bg-gray-100 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">My App</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="hover:text-gray-500">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-gray-500">
                About
              </a>
            </li>
            {isLoading ? (
              <li>Loading...</li>
            ) : error ? (
              <li>Error...</li>
            ) : user ? (
              <li>
                <Button>Logout</Button>
              </li>
            ) : (
              <li>
                <Button>Login</Button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header

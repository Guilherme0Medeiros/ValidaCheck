"use client"
import { createContext, useContext, useState, useEffect } from "react"
import type React from "react"
import { Spinner } from "@nextui-org/react"

type User = {
  name: string
  email: string
} | null

const AuthContext = createContext<{
  user: User
  login: (name: string, email: string) => void
  logout: () => void
}>({
  user: null,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)

  
  useEffect(() => {
    try {
      const saved = localStorage.getItem("user")
      if (saved) {
        const userData = JSON.parse(saved)
        setUser(userData)
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error)
      localStorage.removeItem("user")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (name: string, email: string) => {
    const userObj = { name, email }
    setUser(userObj)
    localStorage.setItem("user", JSON.stringify(userObj))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50">
        <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-2xl border border-white/20">
          <div className="relative">
            <Spinner
              size="lg"
              color="secondary"
              classNames={{
                circle1: "border-b-violet-500",
                circle2: "border-b-cyan-500",
              }}
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 animate-pulse"></div>
          </div>
          <span className="text-slate-700 font-semibold text-lg bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
            Carregando experiência...
          </span>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

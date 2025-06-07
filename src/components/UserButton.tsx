"use client"
import { useAuth } from "./AuthProvider"
import { Button } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { User, LogOut } from "lucide-react"

export default function UserButton() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user)
    return (
      <Button
        className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold hover:from-violet-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
        startContent={<User className="w-4 h-4" />}
        onClick={() => router.push("/login")}
      >
        Entrar
      </Button>
    )

  return (
    <div className="flex items-center gap-4 bg-gradient-to-r from-slate-50 to-white p-4 rounded-xl border border-slate-200/50 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-sm text-slate-600">Bem-vindo,</span>
          <div className="font-bold text-slate-800">{user.name}!</div>
        </div>
      </div>
      <Button
        color="danger"
        size="sm"
        variant="flat"
        className="bg-red-50 text-red-600 hover:bg-red-100 font-semibold"
        startContent={<LogOut className="w-4 h-4" />}
        onClick={logout}
      >
        Sair
      </Button>
    </div>
  )
}

"use client"
import { useState } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"
import { Card, CardBody, CardHeader, Button, Input, Link, Divider, Chip } from "@nextui-org/react"
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Sparkles, ArrowLeft } from "lucide-react"


type UserType = {
  name: string
  email: string
  password: string
}

export default function LoginPage() {
  const { user, login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  if (user) {
    router.replace("/")
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError("")
  }


  const getUsers = (): UserType[] => {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem("users") || "[]")
  }
  const setUsers = (users: UserType[]) => {
    localStorage.setItem("users", JSON.stringify(users))
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Por favor, preencha todos os campos obrigatórios")
      return false
    }

    if (!isLogin && !formData.name) {
      setError("Nome é obrigatório para criar conta")
      return false
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      return false
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, insira um email válido")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setIsLoading(true)

    setTimeout(() => {
      try {
        const users = getUsers()

        if (isLogin) {
          
          const userExists = users.find((u) => u.email === formData.email && u.password === formData.password)
          if (!userExists) {
            setError("Email ou senha inválidos.")
            setIsLoading(false)
            return
          }
          login(userExists.name, userExists.email)
          router.replace("/")
        } else {
          
          const emailExists = users.some((u) => u.email === formData.email)
          if (emailExists) {
            setError("Este email já está cadastrado.")
            setIsLoading(false)
            return
          }
          const newUser: UserType = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }
          setUsers([...users, newUser])
          login(newUser.name, newUser.email)
          router.replace("/")
        }
      } catch {
        setError("Erro ao processar. Tente novamente.")
      } finally {
        setIsLoading(false)
      }
    }, 800)
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError("")
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        <div className="mb-6">
          <Link href="/">
            <Button
              isIconOnly
              variant="flat"
              className="bg-white/80 backdrop-blur-sm hover:bg-violet-50 border border-violet-200/50"
            >
              <ArrowLeft className="w-5 h-5 text-violet-600" />
            </Button>
          </Link>
        </div>

        <Card className="shadow-2xl border-none bg-white/90 backdrop-blur-md overflow-hidden">
          <CardHeader className="flex flex-col items-center pb-6 pt-8 bg-gradient-to-r from-violet-500 to-cyan-500 text-white">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-white/30 to-white/20 rounded-xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{isLogin ? "Bem-vindo de volta!" : "Criar conta"}</h1>
            <p className="text-white/80 text-center">
              {isLogin ? "Entre com suas credenciais para continuar" : "Preencha os dados para criar sua conta"}
            </p>
          </CardHeader>

          <CardBody className="px-8 pb-8 pt-6">
            {error && (
              <Chip
                startContent={<AlertCircle className="w-4 h-4" />}
                variant="flat"
                color="danger"
                className="w-full justify-start mb-6 p-3 h-auto bg-red-50 border border-red-200"
              >
                <span className="text-sm text-red-600">{error}</span>
              </Chip>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {!isLogin && (
                <Input
                  name="name"
                  type="text"
                  label=""
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={handleInputChange}
                  startContent={<User className="w-5 h-5 text-slate-400" />}
                  variant="bordered"
                  classNames={{
                    input: "text-slate-800 placeholder:text-slate-500",
                    inputWrapper:
                      "border-slate-300 hover:border-violet-400 focus-within:!border-violet-500 bg-white/50 backdrop-blur-sm",
                  }}
                  size="lg"
                  isRequired={!isLogin}
                />
              )}

              <Input
                name="email"
                type="email"
                label=""
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                startContent={<Mail className="w-5 h-5 text-slate-400" />}
                variant="bordered"
                classNames={{
                  input: "text-slate-800 placeholder:text-slate-500",
                  inputWrapper:
                    "border-slate-300 hover:border-violet-400 focus-within:!border-violet-500 bg-white/50 backdrop-blur-sm",
                }}
                size="lg"
                isRequired
              />

              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                label=""
                placeholder="Sua senha"
                value={formData.password}
                onChange={handleInputChange}
                startContent={<Lock className="w-5 h-5 text-slate-400" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-violet-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                variant="bordered"
                classNames={{
                  input: "text-slate-800 placeholder:text-slate-500",
                  inputWrapper:
                    "border-slate-300 hover:border-violet-400 focus-within:!border-violet-500 bg-white/50 backdrop-blur-sm",
                }}
                size="lg"
                isRequired
              />

              {!isLogin && (
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  label=""
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  startContent={<Lock className="w-5 h-5 text-slate-400" />}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-slate-400 hover:text-violet-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                  variant="bordered"
                  classNames={{
                    input: "text-slate-800 placeholder:text-slate-500",
                    inputWrapper:
                      "border-slate-300 hover:border-violet-400 focus-within:!border-violet-500 bg-white/50 backdrop-blur-sm",
                  }}
                  size="lg"
                  isRequired={!isLogin}
                />
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-bold text-lg py-6 mt-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
                size="lg"
                isLoading={isLoading}
                startContent={!isLoading ? <Sparkles className="w-5 h-5" /> : null}
                spinner={<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              >
                {isLoading ? (isLogin ? "Entrando..." : "Criando conta...") : isLogin ? "Entrar" : "Criar conta"}
              </Button>
            </form>

            {isLogin && (
              <div className="text-center mt-6">
                <Link
                  href="/forgot-password"
                  className="text-sm text-violet-600 hover:text-violet-700 transition-colors font-medium"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
            )}

            <div className="flex items-center gap-4 my-8">
              <Divider className="flex-1 bg-slate-200" />
              <span className="text-sm text-slate-500 bg-slate-50 px-3 py-1 rounded-full">ou</span>
              <Divider className="flex-1 bg-slate-200" />
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-600">
                {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
                <Link
                  as="button"
                  onClick={toggleMode}
                  className="text-violet-600 hover:text-violet-700 font-bold transition-colors"
                >
                  {isLogin ? "Criar conta" : "Fazer login"}
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

"use client"
import { Button } from "@nextui-org/react"
import { useEffect } from "react"
import { AlertTriangle, RefreshCw, Home, Sparkles } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global error:", error)
  }, [error])

  return (
    <html>
      <body className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-lg w-full">
          
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                <AlertTriangle className="w-16 h-16 text-red-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          
          <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-red-200/50">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 text-center">
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-3xl font-bold mb-2">Algo deu errado</h1>
              <p className="text-white/90">Encontramos um problema inesperado</p>
            </div>

            
            <div className="p-8">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 mb-8 border border-red-200/50">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />O que aconteceu?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Houve um erro inesperado em nossa aplicação. Nossa equipe foi notificada automaticamente e está
                  trabalhando para resolver o problema.
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-8 border border-blue-200/50">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />O que você pode fazer?
                </h3>
                <ul className="text-slate-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Tentar Novamente
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Voltar para a página principal
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Aguardar alguns minutos e tentar novamente
                  </li>
                </ul>
              </div>

            
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
                  onClick={() => reset()}
                  startContent={<RefreshCw className="w-5 h-5" />}
                >
                  Tentar Novamente
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
                  onClick={() => (window.location.href = "/")}
                  startContent={<Home className="w-5 h-5" />}
                >
                  Voltar ao Início
                </Button>
              </div>

              {error.digest && (
                <div className="mt-6 p-4 bg-slate-100 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-mono">ID do erro: {error.digest}</p>
                </div>
              )}
            </div>
          </div>

          
          <div className="text-center mt-8">
            <p className="text-slate-500 text-sm">Se o problema persistir, entre em contato com nosso suporte</p>
          </div>
        </div>
      </body>
    </html>
  )
}

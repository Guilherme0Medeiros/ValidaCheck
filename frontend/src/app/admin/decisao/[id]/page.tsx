"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, FileText, Check, X, Edit3, RotateCcw, Calendar, User, Clock, Download } from "lucide-react"
import Link from "next/link"

export default function DecisaoPage() {
  const params = useParams()
  const router = useRouter()
  const [comentario, setComentario] = useState("")
  const [horasAjustadas, setHorasAjustadas] = useState("")
  const [showHorasInput, setShowHorasInput] = useState(false)

  // Mock data - em uma aplicação real, isso viria de uma API
  const relatorio = {
    id: params.id,
    aluno: "Ana Souza",
    atividade: "Participação em congresso",
    categoria: "Pesquisa",
    horasSolicitadas: 16,
    dataEnvio: "10/04/2024",
    status: "em_analise",
    historico: [
      {
        acao: "Enviado",
        data: "10 de abril de 2024",
        status: "enviado",
      },
      {
        acao: "Solicitar complementação",
        data: "15 de abril de 2024",
        status: "complementacao",
      },
      {
        acao: "Enviado",
        data: "15 abril de 2024",
        status: "enviado",
      },
    ],
  }

  const handleAprovar = () => {
    // Lógica para aprovar
    console.log("Aprovando relatório:", relatorio.id)
    router.push("/admin/relatorios")
  }

  const handleIndeferir = () => {
    // Lógica para indeferir
    console.log("Indeferindo relatório:", relatorio.id, "Comentário:", comentario)
    router.push("/admin/relatorios")
  }

  const handleAjustarHoras = () => {
    // Lógica para ajustar horas
    console.log("Ajustando horas:", horasAjustadas, "Comentário:", comentario)
    router.push("/admin/relatorios")
  }

  const handleSolicitarComplementacao = () => {
    // Lógica para solicitar complementação
    console.log("Solicitando complementação:", comentario)
    router.push("/admin/relatorios")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="w-8 h-8 bg-blue-500 rounded"></div>
              <nav className="flex space-x-8">
                <Link href="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Início
                </Link>
                <Link
                  href="/atividades"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Atividades
                </Link>
                <Link
                  href="/relatorios"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Relatórios
                </Link>
                <Link
                  href="/admin/relatorios"
                  className="text-blue-600 bg-blue-50 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/admin/relatorios"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para relatórios</span>
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tela de decisão</h1>
        </div>

        {/* Report Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{relatorio.atividade}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{relatorio.aluno}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{relatorio.dataEnvio}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{relatorio.horasSolicitadas}h solicitadas</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* PDF Viewer */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Documento</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">PDF</p>
              <button className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Baixar documento</span>
              </button>
            </div>
          </div>

          {/* Comment Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Comentário</h3>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Adicione seus comentários sobre o relatório..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />

            {showHorasInput && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Horas aprovadas</label>
                <input
                  type="number"
                  value={horasAjustadas}
                  onChange={(e) => setHorasAjustadas(e.target.value)}
                  placeholder={`Máximo: ${relatorio.horasSolicitadas}h`}
                  max={relatorio.horasSolicitadas}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico</h3>
          <div className="space-y-4">
            {relatorio.historico.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.status === "enviado"
                        ? "bg-blue-500"
                        : item.status === "complementacao"
                          ? "bg-orange-500"
                          : "bg-gray-400"
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">{item.acao}</span>
                </div>
                <span className="text-sm text-gray-600">{item.data}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleAprovar}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <Check className="w-5 h-5" />
            <span>Aprovar</span>
          </button>

          <button
            onClick={() => setShowHorasInput(!showHorasInput)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="w-5 h-5" />
            <span>Ajustar horas</span>
          </button>

          {showHorasInput && (
            <button
              onClick={handleAjustarHoras}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Check className="w-5 h-5" />
              <span>Confirmar ajuste</span>
            </button>
          )}

          <button
            onClick={handleIndeferir}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <X className="w-5 h-5" />
            <span>Indeferir</span>
          </button>

          <button
            onClick={handleSolicitarComplementacao}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Solicitar complementação</span>
          </button>
        </div>
      </div>
    </div>
  )
}

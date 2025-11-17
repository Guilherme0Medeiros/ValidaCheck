import {
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Download,
  Calendar,
} from "lucide-react"

export default function RelatoriosPage() {
  const relatorios = [
    {
      id: 1,
      atividade: "Participação em congresso",
      categoria: "Pesquisa",
      dataEnvio: "10/04/2024",
      status: "Rascunho",
      horasSolicitadas: 0,
      horasConcedidas: 0,
      statusColor: "text-gray-500",
      statusBg: "bg-gray-100",
    },
    {
      id: 2,
      atividade: "Projeto de extensão comunitária",
      categoria: "Extensão",
      dataEnvio: "02/04/2024",
      status: "Enviado",
      horasSolicitadas: 40,
      horasConcedidas: 0,
      statusColor: "text-blue-600",
      statusBg: "bg-blue-100",
    },
    {
      id: 3,
      atividade: "Atividades de monitoria",
      categoria: "Monitoria",
      dataEnvio: "20/03/2024",
      status: "Em análise",
      horasSolicitadas: 20,
      horasConcedidas: 0,
      statusColor: "text-yellow-600",
      statusBg: "bg-yellow-100",
    },
    {
      id: 4,
      atividade: "Curso de capacitação",
      categoria: "Ensino",
      dataEnvio: "05/03/2024",
      status: "Aprovado com ajuste",
      horasSolicitadas: 10,
      horasConcedidas: 8,
      statusColor: "text-green-600",
      statusBg: "bg-green-100",
    },
    {
      id: 5,
      atividade: "Workshop de tecnologia",
      categoria: "Ensino",
      dataEnvio: "28/02/2024",
      status: "Aprovado",
      horasSolicitadas: 15,
      horasConcedidas: 15,
      statusColor: "text-green-600",
      statusBg: "bg-green-100",
    },
    {
      id: 6,
      atividade: "Seminário de pesquisa",
      categoria: "Pesquisa",
      dataEnvio: "15/02/2024",
      status: "Rejeitado",
      horasSolicitadas: 8,
      horasConcedidas: 0,
      statusColor: "text-red-600",
      statusBg: "bg-red-100",
    },
  ]

  const totalHorasObrigatorias = 80
  const horasCompletadas = relatorios
    .filter((r) => r.status === "Aprovado" || r.status === "Aprovado com ajuste")
    .reduce((total, r) => total + r.horasConcedidas, 0)
  const percentualCompleto = Math.round((horasCompletadas / totalHorasObrigatorias) * 100)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aprovado":
        return <CheckCircle className="w-4 h-4" />
      case "Aprovado com ajuste":
        return <CheckCircle className="w-4 h-4" />
      case "Em análise":
        return <Clock className="w-4 h-4" />
      case "Enviado":
        return <AlertCircle className="w-4 h-4" />
      case "Rejeitado":
        return <XCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600 mt-1">Gerencie suas atividades complementares</p>
          </div>
          <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="w-5 h-5 mr-2" />
            Enviar novo relatório
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Horas Aprovadas</p>
                <p className="text-2xl font-bold text-gray-900">{horasCompletadas}h</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Em Análise</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Relatórios</p>
                <p className="text-2xl font-bold text-gray-900">{relatorios.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Progresso</p>
                <p className="text-2xl font-bold text-gray-900">{percentualCompleto}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtro
                </button>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Todas as categorias</option>
                  <option>Pesquisa</option>
                  <option>Extensão</option>
                  <option>Monitoria</option>
                  <option>Ensino</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar relatórios..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                  />
                </div>
                <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Atividade</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Categoria</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Data de envio</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                    Horas solicitadas vs. concedidas
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {relatorios.map((relatorio) => (
                  <tr key={relatorio.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{relatorio.atividade}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {relatorio.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{relatorio.dataEnvio}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${relatorio.statusBg} ${relatorio.statusColor}`}
                      >
                        {getStatusIcon(relatorio.status)}
                        <span className="ml-1">{relatorio.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {relatorio.horasSolicitadas > 0 ? (
                        <span>
                          {relatorio.horasSolicitadas} — {relatorio.horasConcedidas}
                        </span>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Progresso das Horas Obrigatórias</h3>
            <span className="text-sm text-gray-600">
              {horasCompletadas} de {totalHorasObrigatorias} horas
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${percentualCompleto}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            Você completou <span className="font-semibold text-gray-900">{percentualCompleto}%</span> de{" "}
            {totalHorasObrigatorias}h obrigatórias
          </p>
        </div>
      </div>
    </div>
  )
}
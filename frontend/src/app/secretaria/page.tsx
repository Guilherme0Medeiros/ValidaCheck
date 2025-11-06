"use client";

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
  Users,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavBar from "../../../components/navBar";

export default function RelatoriosPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Estados para busca e filtro
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  // Lidar com a Role
  useEffect(() => {
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

    if (!role) {
      router.replace("/login");
    } else if (role !== "secretary") {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;

  const relatorios = [
    {
      id: 1,
      aluno: "Ana Souza",
      atividade: "Participação em congresso",
      categoria: "Pesquisa",
      horasSolicitadas: 16,
      status: "analisar",
      dataEnvio: "10/04/2024",
    },
    {
      id: 2,
      aluno: "Lucas Lima",
      atividade: "Projeto de extensão comunitária",
      categoria: "Extensão",
      horasSolicitadas: 40,
      status: "em_analise",
      dataEnvio: "08/04/2024",
    },
    {
      id: 3,
      aluno: "Mariana Santos",
      atividade: "Atividades de monitoria",
      categoria: "Monitoria",
      horasSolicitadas: 20,
      status: "analisar",
      dataEnvio: "05/04/2024",
    },
    {
      id: 4,
      aluno: "Pedro Almeida",
      atividade: "Curso de capacitação",
      categoria: "Ensino",
      horasSolicitadas: 10,
      status: "aprovado",
      dataEnvio: "02/04/2024",
    },
    {
      id: 5,
      aluno: "Julia Costa",
      atividade: "Seminário de pesquisa",
      categoria: "Pesquisa",
      horasSolicitadas: 8,
      status: "aguardando_complementacao",
      dataEnvio: "01/04/2024",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "analisar":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "em_analise":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "aprovado":
        return "bg-green-100 text-green-800 border-green-200";
      case "aguardando_complementacao":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "rejeitado":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "analisar":
        return "Analisar";
      case "em_analise":
        return "Em análise";
      case "aprovado":
        return "Aprovado";
      case "aguardando_complementacao":
        return "Aguardando complementação";
      case "rejeitado":
        return "Rejeitado";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "analisar":
        return <Eye className="w-4 h-4" />;
      case "em_analise":
        return <Clock className="w-4 h-4" />;
      case "aprovado":
        return <CheckCircle className="w-4 h-4" />;
      case "aguardando_complementacao":
        return <AlertCircle className="w-4 h-4" />;
      case "rejeitado":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const filteredRelatorios = relatorios.filter((relatorio) => {
    const matchesSearch =
      relatorio.aluno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relatorio.atividade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "todos" || relatorio.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    emAnalise: relatorios.filter(
      (r) => r.status === "em_analise" || r.status === "analisar"
    ).length,
    aguardandoComplementacao: relatorios.filter(
      (r) => r.status === "aguardando_complementacao"
    ).length,
    aprovados: relatorios.filter((r) => r.status === "aprovado").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <NavBar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600 mt-1">Gerencie suas atividades complementares</p>
          </div>
          <Link href="/secretaria/decisao">
            <button className="flex items-center px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              <Plus className="w-5 h-5 mr-2" />
              Enviar novo relatório
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{stats.emAnalise}</p>
                <p className="text-sm text-gray-600 mt-1">relatórios em análise</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.aguardandoComplementacao}
                </p>
                <p className="text-sm text-gray-600 mt-1">aguardando complementação</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{stats.aprovados}</p>
                <p className="text-sm text-gray-600 mt-1">aprovados</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filtro</span>
              </button>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todos os status</option>
                <option value="analisar">Para analisar</option>
                <option value="em_analise">Em análise</option>
                <option value="aprovado">Aprovados</option>
                <option value="aguardando_complementacao">Aguardando complementação</option>
              </select>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por aluno ou atividade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Aluno</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Atividade</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Categoria</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Horas solicitadas
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRelatorios.map((relatorio) => (
                  <tr key={relatorio.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {relatorio.aluno}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{relatorio.atividade}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{relatorio.categoria}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {relatorio.horasSolicitadas}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          relatorio.status
                        )}`}
                      >
                        {getStatusIcon(relatorio.status)}
                        <span>{getStatusText(relatorio.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {(relatorio.status === "analisar" ||
                        relatorio.status === "em_analise") && (
                        <Link
                          href={`/admin/decisao/${relatorio.id}`}
                          className="inline-flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Analisar</span>
                        </Link>
                      )}
                      {relatorio.status === "aprovado" && (
                        <span className="inline-flex items-center space-x-1 px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-lg">
                          <CheckCircle className="w-4 h-4" />
                          <span>Aprovado</span>
                        </span>
                      )}
                      {relatorio.status === "aguardando_complementacao" && (
                        <Link
                          href={`/admin/decisao/${relatorio.id}`}
                          className="inline-flex items-center space-x-1 px-4 py-2 bg-orange-100 text-orange-800 text-sm font-medium rounded-lg hover:bg-orange-200 transition-colors"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>Revisar</span>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredRelatorios.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Nenhum relatório encontrado com os filtros aplicados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
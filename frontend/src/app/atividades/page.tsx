"use client";

import {
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavBar from "../../../components/navBar";

export default function AtividadesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  // Verifica a role do usuário
  useEffect(() => {
    const role =
      typeof window !== "undefined" ? localStorage.getItem("role") : null;

    if (!role) {
      router.replace("/login");
    } else if (role !== "student") {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) return <div>Carregando...</div>;

  // Dados simulados
  const atividades = [
    {
      id: 1,
      titulo: "Projeto de Extensão em Saúde Comunitária",
      categoria: "Extensão",
      horas: 40,
      status: "em_andamento",
      dataInicio: "10/04/2025",
    },
    {
      id: 2,
      titulo: "Monitoria em Bioquímica",
      categoria: "Ensino",
      horas: 20,
      status: "em_andamento",
      dataInicio: "02/05/2025",
    },
    {
      id: 3,
      titulo: "Participação em Congresso Regional de Nutrição",
      categoria: "Pesquisa",
      horas: 16,
      status: "finalizada",
      dataInicio: "15/03/2025",
    },
  ];

  // Cores e textos de status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "em_andamento":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "finalizada":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "em_andamento":
        return "Em andamento";
      case "finalizada":
        return "Finalizada";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "em_andamento":
        return <Clock className="w-4 h-4" />;
      case "finalizada":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Filtro e busca
  const filteredAtividades = atividades.filter((atividade) => {
    const matchesSearch = atividade.titulo
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "todos" || atividade.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Estatísticas
  const stats = {
    emAndamento: atividades.filter((a) => a.status === "em_andamento").length,
    finalizadas: atividades.filter((a) => a.status === "finalizada").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Atividades em andamento
            </h1>
            <p className="text-gray-600 mt-1">
              Acompanhe suas atividades complementares em andamento
            </p>
          </div>
          <Link href={"/estudante/nova-atividade"}>
            <button className="flex items-center px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              <Plus className="w-5 h-5 mr-2" />
              Nova atividade
            </button>
          </Link>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.emAndamento}
                </p>
                <p className="text-sm text-gray-600 mt-1">em andamento</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.finalizadas}
                </p>
                <p className="text-sm text-gray-600 mt-1">finalizadas</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros e busca */}
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
                <option value="em_andamento">Em andamento</option>
                <option value="finalizada">Finalizadas</option>
              </select>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar atividade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Atividade
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Categoria
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Horas
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Início
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAtividades.map((atividade) => (
                  <tr key={atividade.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {atividade.titulo}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {atividade.categoria}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {atividade.horas}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {atividade.dataInicio}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          atividade.status
                        )}`}
                      >
                        {getStatusIcon(atividade.status)}
                        <span>{getStatusText(atividade.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {atividade.status === "em_andamento" && (
                        <Link
                          href={`/estudante/atividade/${atividade.id}`}
                          className="inline-flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Ver detalhes</span>
                        </Link>
                      )}
                      {atividade.status === "finalizada" && (
                        <span className="inline-flex items-center space-x-1 px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-lg">
                          <CheckCircle className="w-4 h-4" />
                          <span>Concluída</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredAtividades.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Nenhuma atividade encontrada com os filtros aplicados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

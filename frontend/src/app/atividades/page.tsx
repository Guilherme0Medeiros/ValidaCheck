"use client";

import {
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  Users,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavBar from "../../../components/navBar";
import api from "@/lib/axios";

export default function AtividadesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [atividades, setAtividades] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  // Carrega atividades do backend
  useEffect(() => {
    const role =
      typeof window !== "undefined" ? localStorage.getItem("role") : null;

    if (!role) {
      router.replace("/login");
      return;
    }
    if (role !== "student") {
      router.push("/login");
      return;
    }

    api
      .get("activities/atividades/")
      .then((res) => {
        setAtividades(res.data.results || res.data); // suporta paginação
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("❌ Erro ao carregar atividades:", err);
        setIsLoading(false);
      });
  }, [router]);

  if (isLoading) return <div>Carregando...</div>;

  // Helpers visuais
  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes("aprov")) return "bg-green-100 text-green-800 border-green-200";
    if (status.toLowerCase().includes("análise")) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (status.toLowerCase().includes("indef")) return "bg-red-100 text-red-800 border-red-200";
    if (status.toLowerCase().includes("complement")) return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status: string) => {
    if (status.toLowerCase().includes("aprov")) return <CheckCircle className="w-4 h-4" />;
    if (status.toLowerCase().includes("análise")) return <Clock className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  // Filtro e busca
  const filteredAtividades = atividades.filter((atividade) => {
    const matchesSearch = atividade.titulo
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "todos" ||
      atividade.status.toLowerCase().includes(filterStatus);
    return matchesSearch && matchesFilter;
  });

  // Estatísticas
  const stats = {
    emAndamento: atividades.filter((a) =>
      a.status.toLowerCase().includes("análise")
    ).length,
    finalizadas: atividades.filter((a) =>
      a.status.toLowerCase().includes("aprov")
    ).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Atividades Complementares
            </h1>
            <p className="text-gray-600 mt-1">
              Acompanhe suas atividades cadastradas
            </p>
          </div>
          <Link href={"/estudante/nova-atividade"}>
            <button className="flex items-center px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              <Plus className="w-5 h-5 mr-2" />
              Nova atividade
            </button>
          </Link>
        </div>

        {/* Cards resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.emAndamento}
                </p>
                <p className="text-sm text-gray-600 mt-1">em análise</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.finalizadas}
                </p>
                <p className="text-sm text-gray-600 mt-1">aprovadas</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Busca e filtro */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todos">Todos os status</option>
              <option value="análise">Em análise</option>
              <option value="aprov">Aprovadas</option>
              <option value="indef">Indeferidas</option>
            </select>

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
                      {atividade.categoria_nome || atividade.categoria}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {atividade.horas_concedidas || atividade.horas_solicitadas}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {atividade.data_inicio || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          atividade.status
                        )}`}
                      >
                        {getStatusIcon(atividade.status)}
                        <span>{atividade.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/atividades/${atividade.id}`}
                        className="inline-flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Ver detalhes</span>
                      </Link>
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

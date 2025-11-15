"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import NavBar from "../../../../components/navBar"; // Caminho corrigido

export default function AdminRelatoriosPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]); // Estado para atividades da API
  const [categories, setCategories] = useState<any[]>([]); // Estado para categorias da API

  // Estados para busca e filtro
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  // Lidar com a Role (proteger a página)
  useEffect(() => {
    const role =
      typeof window !== "undefined" ? localStorage.getItem("role") : null;

    if (!role) {
      router.replace("/login");
    } else if (role !== "secretary") {
      // Apenas 'secretary' pode ver esta página
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // Buscar dados da API
  useEffect(() => {
    // Só busca dados se não estiver carregando (ou seja, se a role já foi verificada)
    if (!isLoading) {
      async function fetchData() {
        try {
          const [actsRes, catsRes] = await Promise.all([
            api.get("activities/atividades/"), // Busca todas atividades
            api.get("activities/categorias/"), // Busca categorias para mapear nomes
          ]);
          setActivities(
            Array.isArray(actsRes.data) ? actsRes.data : actsRes.data.results || []
          );
          setCategories(
            Array.isArray(catsRes.data)
              ? catsRes.data
              : catsRes.data.results || []
          );
        } catch (error) {
          console.error("Error fetching data:", error);
          // Adicionar tratamento de erro (ex: mostrar toast)
        }
      }

      fetchData();
    }
  }, [isLoading]); // Depende do isLoading para rodar após a verificação de role

  // ----- Funções de Status (copiadas de secretaria/page.tsx) -----
  // Usam os status reais do backend
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Enviado":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Em análise":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Aprovado":
      case "Aprovado com ajuste":
      case "Computado":
        return "bg-green-100 text-green-800 border-green-200";
      case "Complementação solicitada":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Indeferido":
        return "bg-red-100 text-red-800 border-red-200";
      case "Rascunho":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Enviado":
        return "Analisar";
      case "Em análise":
        return "Em análise";
      case "Aprovado":
        return "Aprovado";
      case "Aprovado com ajuste":
        return "Aprovado com ajuste";
      case "Complementação solicitada":
        return "Aguardando complementação";
      case "Indeferido":
        return "Indeferido";
      case "Computado":
        return "Computado";
      case "Rascunho":
        return "Rascunho";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Enviado":
        return <Eye className="w-4 h-4" />;
      case "Em análise":
        return <Clock className="w-4 h-4" />;
      case "Aprovado":
      case "Aprovado com ajuste":
      case "Computado":
        return <CheckCircle className="w-4 h-4" />;
      case "Complementação solicitada":
        return <AlertCircle className="w-4 h-4" />;
      case "Indeferido":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };
  // ----- Fim das Funções de Status -----

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Carregando...
      </div>
    );
  }

  // Transforma os dados da API para o formato que a tabela espera
  const relatorios = activities.map((atividade) => ({
    id: atividade.id,
    aluno: atividade.enviado_por || "Aluno desconhecido", // 'enviado_por' vem do serializer
    atividade: atividade.titulo,
    categoria:
      categories.find((c) => c.id === atividade.categoria)?.nome ||
      "Desconhecida",
    horasSolicitadas: atividade.horas_solicitadas,
    status: atividade.status, // Status real
    dataEnvio: new Date(atividade.criado_em).toLocaleDateString("pt-BR"),
  }));

  // Filtra os dados reais
  const filteredRelatorios = relatorios.filter((relatorio) => {
    const matchesSearch =
      relatorio.aluno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relatorio.atividade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "todos" || relatorio.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Calcula estatísticas com dados reais
  const stats = {
    emAnalise: activities.filter(
      (r) => r.status === "Enviado" || r.status === "Em análise"
    ).length,
    aguardandoComplementacao: activities.filter(
      (r) => r.status === "Complementação solicitada"
    ).length,
    aprovados: activities.filter(
      (r) =>
        r.status === "Aprovado" ||
        r.status === "Aprovado com ajuste" ||
        r.status === "Computado"
    ).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header unificado */}
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-2">
            Gerencie e analise os relatórios dos alunos
          </p>
        </div>

        {/* Stats Cards (agora com dados reais) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.emAnalise}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  relatórios em análise
                </p>
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
                <p className="text-sm text-gray-600 mt-1">
                  aguardando complementação
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.aprovados}
                </p>
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

              {/* Filtros com status reais */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todos os status</option>
                <option value="Enviado">Para analisar</option>
                <option value="Em análise">Em análise</option>
                <option value="Aprovado">Aprovados</option>
                <option value="Aprovado com ajuste">Aprovado com ajuste</option>
                <option value="Complementação solicitada">
                  Aguardando complementação
                </option>
                <option value="Indeferido">Indeferido</option>
                <option value="Computado">Computado</option>
                <option value="Rascunho">Rascunho</option>
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

        {/* Reports Table (agora com dados reais) */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Aluno
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Atividade
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Categoria
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Horas solicitadas
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
                      <span className="text-sm text-gray-900">
                        {relatorio.atividade}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {relatorio.categoria}
                      </span>
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
                      {/* Lógica de Ações com status reais */}
                      {(relatorio.status === "Enviado" ||
                        relatorio.status === "Em análise") && (
                        <Link
                          href={`/admin/decisao/${relatorio.id}`}
                          className="inline-flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Analisar</span>
                        </Link>
                      )}
                      {(relatorio.status === "Aprovado" ||
                        relatorio.status === "Aprovado com ajuste" ||
                        relatorio.status === "Computado") && (
                        <span className="inline-flex items-center space-x-1 px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-lg">
                          <CheckCircle className="w-4 h-4" />
                          <span>Aprovado</span>
                        </span>
                      )}
                      {relatorio.status === "Complementação solicitada" && (
                        <Link
                          href={`/admin/decisao/${relatorio.id}`}
                          className="inline-flex items-center space-x-1 px-4 py-2 bg-orange-100 text-orange-800 text-sm font-medium rounded-lg hover:bg-orange-200 transition-colors"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>Revisar</span>
                        </Link>
                      )}
                      {relatorio.status === "Indeferido" && (
                        <span className="inline-flex items-center space-x-1 px-4 py-2 bg-red-100 text-red-800 text-sm font-medium rounded-lg">
                          <XCircle className="w-4 h-4" />
                          <span>Indeferido</span>
                        </span>
                      )}
                      {/* ADIÇÃO DA LÓGICA PARA RASCUNHO: */}
                      {relatorio.status === "Rascunho" && (
                        <span className="inline-flex items-center space-x-1 px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg">
                          (N/A)
                        </span>
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
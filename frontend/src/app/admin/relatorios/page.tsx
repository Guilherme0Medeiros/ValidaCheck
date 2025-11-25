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

/* 👉 IMPORT DA NAVBAR */
import NavBarSecretary from "../../../../components/navBarSecretary";

export default function AdminRelatoriosPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [relatorios, setRelatorios] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role) {
      router.replace("/login");
      return;
    }
    if (role !== "secretary") {
      router.push("/login");
      return;
    }

    carregar();
  }, []);

  async function carregar() {
    try {
      const res = await api.get("/activities/relatorios/");
      setRelatorios(res.data.results || res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const getStatusColor = (s: string) => {
    switch (s) {
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
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
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
        return <FileText className="w-4 h-4" />;
    }
  };

  const filtrados = relatorios.filter((r) => {
    const busca =
      r.atividade_titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.enviado_por_nome?.toLowerCase().includes(searchTerm.toLowerCase());

    const filtro = filterStatus === "todos" || r.status === filterStatus;

    return busca && filtro;
  });

  const stats = {
    emAnalise: relatorios.filter(
      (r) => r.status === "Enviado" || r.status === "Em análise"
    ).length,
    aprovados: relatorios.filter(
      (r) =>
        r.status === "Aprovado" ||
        r.status === "Aprovado com ajuste" ||
        r.status === "Computado"
    ).length,
    complementacao: relatorios.filter(
      (r) => r.status === "Complementação solicitada"
    ).length,
  };

  if (isLoading) return <div>Carregando…</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 👉 NAVBAR AQUI */}
      <NavBarSecretary />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Relatórios Enviados
        </h1>
        <p className="text-gray-600 mb-8">
          Acompanhe, analise e aprove relatórios enviados pelos alunos.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Em análise */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.emAnalise}
                </p>
                <p className="text-sm text-gray-600 mt-1">Em análise</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Aguardando complementação */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.complementacao}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Aguardando complementação
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Aprovados */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.aprovados}
                </p>
                <p className="text-sm text-gray-600 mt-1">Aprovados</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">

            {/* Select estilizado */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="todos">Todos os status</option>
              <option value="Enviado">Para analisar</option>
              <option value="Em análise">Em análise</option>
              <option value="Complementação solicitada">
                Aguardando complementação
              </option>
              <option value="Aprovado">Aprovados</option>
              <option value="Aprovado com ajuste">Aprovado com ajuste</option>
              <option value="Indeferido">Indeferido</option>
              <option value="Computado">Computado</option>
              <option value="Rascunho">Rascunho</option>
            </select>

            {/* Campo de busca estilizado */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por aluno ou atividade..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Arquivo
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filtrados.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* Aluno */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {r.enviado_por_nome}
                      </span>
                    </div>
                  </td>

                  {/* Atividade */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">
                      {r.atividade_titulo}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        r.status
                      )}`}
                    >
                      {getStatusIcon(r.status)}
                      <span>{r.status}</span>
                    </span>
                  </td>

                  {/* Arquivo */}
                  <td className="px-6 py-4">
                    <a
                      href={r.arquivo}
                      target="_blank"
                      className="text-blue-600 hover:underline font-medium flex items-center space-x-1"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Ver arquivo</span>
                    </a>
                  </td>

                  {/* Ações */}
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/relatorios/${r.id}`}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Analisar</span>
                    </Link>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtrados.length === 0 && (
          <div className="text-center py-10 text-gray-600">
            Nenhum relatório encontrado.
          </div>
        )}

      </div>
    </div>
  );
}

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

    const filtro =
      filterStatus === "todos" || r.status === filterStatus;

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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Relatórios Enviados
        </h1>
        <p className="text-gray-600 mb-8">
          Acompanhe, analise e aprove relatórios enviados pelos alunos.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg border">
            <p className="text-3xl font-bold">{stats.emAnalise}</p>
            <p className="text-gray-600">Em análise</p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <p className="text-3xl font-bold">{stats.complementacao}</p>
            <p className="text-gray-600">Aguardando complementação</p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <p className="text-3xl font-bold">{stats.aprovados}</p>
            <p className="text-gray-600">Aprovados</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <select
              className="border px-4 py-2 rounded-lg"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="Enviado">Para analisar</option>
              <option value="Em análise">Em análise</option>
              <option value="Complementação solicitada">
                Complementação solicitada
              </option>
              <option value="Aprovado">Aprovados</option>
              <option value="Aprovado com ajuste">Aprovado com ajuste</option>
              <option value="Indeferido">Indeferidos</option>
            </select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por aluno ou título..."
                className="pl-10 border px-4 py-2 rounded-lg w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left">Aluno</th>
                <th className="px-6 py-4 text-left">Atividade</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Arquivo</th>
                <th className="px-6 py-4 text-left">Ações</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 border-b">
                  <td className="px-6 py-4 flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    {r.enviado_por_nome}
                  </td>

                  <td className="px-6 py-4">{r.atividade_titulo}</td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        r.status
                      )}`}
                    >
                      {getStatusIcon(r.status)}
                      <span className="ml-1">{r.status}</span>
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

                  {/* Ação */}
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/relatorios/${r.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-1"
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

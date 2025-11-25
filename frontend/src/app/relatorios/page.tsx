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
} from "lucide-react";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import NavBar from "../../../components/navBar";

export default function RelatoriosPage() {
  const router = useRouter();
  const [relatorios, setRelatorios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token || !role) {
      router.replace("/login");
      return;
    }

    if (role !== "student") {
      router.replace("/login");
      return;
    }

    carregarRelatorios();
  }, []);

  async function carregarRelatorios() {
    try {
      const token = localStorage.getItem("access_token");

      const response = await api.get("/activities/relatorios/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRelatorios(response.data.results || response.data);
    } catch (error) {
      console.error("Erro ao carregar relatórios:", error);

      // se o token expirou → manda pro login
      // evita loop infinito
      if ((error as any)?.response?.status === 401) {
        localStorage.removeItem("access_token");
        router.replace("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  const totalHorasObrigatorias = 80;

  const horasCompletadas = relatorios
    .filter(
      (r) => r.status === "Aprovado" || r.status === "Aprovado com ajuste"
    )
    .reduce((total, r) => total + (r.atividade?.horas_concedidas || 0), 0);

  const percentualCompleto = Math.round(
    (horasCompletadas / totalHorasObrigatorias) * 100
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aprovado":
      case "Aprovado com ajuste":
        return <CheckCircle className="w-4 h-4" />;
      case "Em análise":
        return <Clock className="w-4 h-4" />;
      case "Enviado":
        return <AlertCircle className="w-4 h-4" />;
      case "Indeferido":
      case "Rejeitado":
        return <XCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
      case "Aprovado com ajuste":
        return "bg-green-100 text-green-600";
      case "Em análise":
        return "bg-yellow-100 text-yellow-600";
      case "Enviado":
        return "bg-blue-100 text-blue-600";
      case "Indeferido":
      case "Rejeitado":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Carregando...</div>;
  }

  return (
    <>
    <NavBar />

    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600 mt-1">
              Gerencie seus relatórios de atividades complementares
            </p>
          </div>

          <Link href="/relatorios/novo">
            <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              <Plus className="w-5 h-5 mr-2" />
              Enviar novo relatório
            </button>
          </Link>
        </div>

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
                <p className="text-2xl font-bold text-gray-900">
                  {relatorios.filter((r) => r.status === "Em análise").length}
                </p>
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

        {/* TABELA */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Atividade</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Categoria</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Data de envio</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Horas</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {relatorios.map((relatorio) => (
                  <tr key={relatorio.id} className="hover:bg-gray-50 transition-colors">

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {relatorio.atividade_titulo}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {relatorio.atividade?.categoria_nome ?? "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(relatorio.criado_em).toLocaleDateString("pt-BR")}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          relatorio.status
                        )}`}
                      >
                        {getStatusIcon(relatorio.status)}
                        <span className="ml-1">{relatorio.status}</span>
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {relatorio.atividade?.horas_solicitadas
                        ? `${relatorio.atividade.horas_solicitadas} — ${relatorio.atividade.horas_concedidas || 0}`
                        : "—"}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BARRA DE PROGRESSO */}
        
      </div>
    </div>
    </>
  );
}

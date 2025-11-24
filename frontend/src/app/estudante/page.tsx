"use client";

import {
  FileText,
  Clock,
  Plus,
  Award,
  Bell,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Spinner } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavBar from "../../../components/navBar";
import useNotificacoes from "@/hooks/useNotificacoes";
import api from "@/lib/axios";

interface ProgressoData {
  total_horas: number;
  percentual: number;
  carga_minima: number;
  por_categoria: Record<string, number>;
}

export default function EstudantePagina() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("Aluno(a)");
  
  const [progresso, setProgresso] = useState<ProgressoData | null>(null);
  const [todasAtividades, setTodasAtividades] = useState<any[]>([]);
  const { notificacoes, loading: loadingNotif } = useNotificacoes();

  // Lidar com a Role, Auth e Fetch de Dados
  useEffect(() => {
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    const username = typeof window !== "undefined" ? localStorage.getItem("username") : null;

    if (!role) {
      router.replace("/login");
      return;
    } else if (role !== "student") {
      router.push("/login");
      return;
    }

    if (username) {
      setUserName(username);
    }

    async function fetchData() {
      try {
        const [progressoRes, atividadesRes] = await Promise.all([
          api.get("activities/atividades/progresso/"),
          api.get("activities/atividades/me/")
        ]);

        setProgresso(progressoRes.data);
        setTodasAtividades(atividadesRes.data); // Guarda todas para calcular status
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [router]);

  // Cálculos Dinâmicos baseados nas atividades vindas da API
  const atividadesRecentes = todasAtividades.slice(0, 3);

  const stats = {
    aprovadas: todasAtividades.filter((a) => 
      ["Aprovado", "Aprovado com ajuste", "Computado"].includes(a.status)
    ).length,
    emAnalise: todasAtividades.filter((a) => 
      ["Enviado", "Em análise"].includes(a.status)
    ).length,
    pendentes: todasAtividades.filter((a) => 
      ["Complementação solicitada", "Rascunho", "Indeferido"].includes(a.status)
    ).length,
  };

  // visuais para Atividades Recentes
  const getStatusIcon = (status: string) => {
    if (["Aprovado", "Aprovado com ajuste", "Computado"].includes(status)) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (["Enviado", "Em análise"].includes(status)) return <Clock className="w-5 h-5 text-yellow-500" />;
    if (status === "Indeferido") return <XCircle className="w-5 h-5 text-red-500" />;
    return <AlertCircle className="w-5 h-5 text-blue-500" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner color="warning" label="Loading..." />
      </div>
    );
  }

  const horasComputadas = progresso?.total_horas || 0;
  const cargaMinima = progresso?.carga_minima || 80;
  const percentual = progresso?.percentual || 0;
  const horasRestantes = Math.max(0, cargaMinima - horasComputadas);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <NavBar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Olá, {userName}!
          </h1>
          <p className="text-xl text-gray-600">O que deseja fazer hoje?</p>
        </div>

        {/* Progress Overview */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Seu Progresso
            </h2>
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Horas Complementares</span>
                <span>{horasComputadas} de {cargaMinima}h</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(percentual, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {horasRestantes > 0 
                  ? `Faltam apenas ${horasRestantes} horas para completar!`
                  : "Parabéns! Você completou a carga horária mínima."}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.aprovadas}</div>
                <div className="text-xs text-gray-600">Aprovadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.emAnalise}</div>
                <div className="text-xs text-gray-600">Em análise</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.pendentes}</div>
                <div className="text-xs text-gray-600">Pendentes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-8">
          {/* Solicitar Nova Atividade */}
          <div className="bg-white rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer p-6">
            <Link href="/solicitar-atividade">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="relative">
                    <FileText className="w-8 h-8 text-white" />
                    <Plus className="w-4 h-4 text-white absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-0.5" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Solicitar nova atividade
                </h3>
                <p className="text-gray-600 mb-4">
                  Pedir aprovação de nova atividade
                </p>

                <button className="w-full bg-blue-500 cursor-pointer hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors">
                  Nova Solicitação
                </button>
              </div>
            </Link>
          </div>

          {/* Atividades em Andamento */}
          <div className="bg-white rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer p-6">
            <Link href="/atividades">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Atividades em andamento
                </h3>
                <p className="text-gray-600 mb-4">Ver atividades em progresso</p>
                <button className="w-full border cursor-pointer border-blue-400 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-md transition-colors">
                  Ver Atividades
                </button>
              </div>
            </Link>
          </div>

          {/* Relatórios */}
          <div className="bg-white rounded-lg border border-yellow-200 hover:border-yellow-300 hover:shadow-lg transition-all cursor-pointer p-6">
            <Link href="/relatorios">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Relatórios
                </h3>
                <p className="text-gray-600 mb-4">Gerenciar relatórios</p>
                <button className="w-full border border-yellow-500 text-yellow-600 cursor-pointer hover:bg-yellow-50 py-2 px-4 rounded-md transition-colors">
                  Ver Relatórios
                </button>
              </div>
            </Link>
          </div>
        </div>

        {/* atividades e notificacao */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* atividades recentes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Atividades Recentes
              </h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {atividadesRecentes.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">Nenhuma atividade recente.</p>
              ) : (
                atividadesRecentes.map((atv) => (
                  <div key={atv.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getStatusIcon(atv.status)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {atv.titulo}
                      </p>
                      <p className="text-xs text-gray-600">
                        {atv.status} - {atv.horas_solicitadas}h
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(atv.criado_em).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* notificações dinâmicas */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Notificações
              </h3>
              <Bell className="w-5 h-5 text-gray-400" />
            </div>

            {loadingNotif ? (
              <p className="text-gray-500 text-sm">
                Carregando notificações...
              </p>
            ) : notificacoes.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                Nenhuma notificação recente.
              </p>
            ) : (
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {notificacoes.map((n: any) => { 
                  const tipoCores: Record<string, string> = {
                    nova_atividade: "bg-blue-50 border-l-4 border-blue-500",
                    complementacao_solicitada: "bg-yellow-50 border-l-4 border-yellow-500",
                    decisao: "bg-green-50 border-l-4 border-green-500",
                    meta_atingida: "bg-purple-50 border-l-4 border-purple-500",
                  };

                  const tipoIcone: Record<string, React.ReactNode> = {
                    nova_atividade: <Clock className="w-5 h-5 text-blue-500" />,
                    complementacao_solicitada: <AlertCircle className="w-5 h-5 text-yellow-500" />,
                    decisao: <CheckCircle className="w-5 h-5 text-green-500" />,
                    meta_atingida: <Award className="w-5 h-5 text-purple-500" />,
                  };

                  return (
                    <div
                      key={n.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg ${
                        tipoCores[n.tipo] || "bg-gray-50"
                      }`}
                    >
                      {tipoIcone[n.tipo] || (
                        <Bell className="w-5 h-5 text-gray-500" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {n.titulo}
                        </p>
                        <p className="text-xs text-gray-600">{n.mensagem}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(n.criada_em).toLocaleString("pt-BR")}
                        </span>
                      </div>
                      {!n.lida && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* outros status (Cards Inferiores) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-xl font-bold text-blue-600 mb-1">{stats.pendentes}</div>
            <div className="text-xs text-gray-600">Atividades Pendentes</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-xl font-bold text-green-600 mb-1">{stats.aprovadas}</div>
            <div className="text-xs text-gray-600">Atividades Aprovadas</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-xl font-bold text-yellow-600 mb-1">{stats.emAnalise}</div>
            <div className="text-xs text-gray-600">Em Análise</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-xl font-bold text-purple-600 mb-1">{Math.round(percentual)}%</div>
            <div className="text-xs text-gray-600">Progresso Geral</div>
          </div>
        </div>
      </main>
    </div>
  );
}
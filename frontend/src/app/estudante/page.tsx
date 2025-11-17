"use client";

import {
  Home,
  BookOpen,
  FileText,
  Clock,
  Plus,
  User,
  Award,
  Bell,
  CheckCircle,
  AlertCircle,
  UserRound,
} from "lucide-react";
import { Spinner } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavBar from "../../../components/navBar";
import useNotificacoes from "@/hooks/useNotificacoes"; 

export default function EstudantePagina() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("Aluno(a)"); 
  const { notificacoes, loading } = useNotificacoes(); 

  // Lidar com a Role e buscar o nome do usuário
  useEffect(() => {
    const role =
      typeof window !== "undefined" ? localStorage.getItem("role") : null;
    const username =
      typeof window !== "undefined" ? localStorage.getItem("username") : null;

    if (!role) {
      router.replace("/login");
    } else if (role !== "student") {
      router.push("/login");
    } else {
      // Se é estudante, define o nome e para de carregar
      if (username) {
        setUserName(username);
      }
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner color="warning" label="Loading..." />
      </div>
    );
  }

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
                <span>72 de 80h</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: "90%" }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Faltam apenas 8 horas para completar!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">15</div>
                <div className="text-xs text-gray-600">Aprovadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">3</div>
                <div className="text-xs text-gray-600">Em análise</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">2</div>
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
              {/* Exemplo estático (mantido só pra layout) */}
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Curso de Capacitação
                  </p>
                  <p className="text-xs text-gray-600">
                    Aprovado - 10 horas concedidas
                  </p>
                </div>
                <span className="text-xs text-gray-500">2 dias atrás</span>
              </div>
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

            {loading ? (
              <p className="text-gray-500 text-sm">
                Carregando notificações...
              </p>
            ) : notificacoes.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Nenhuma notificação recente.
              </p>
            ) : (
              <div className="space-y-4">
                {notificacoes.map((n: any) => { // Adicionado 'any' para 'n'
                  const tipoCores: Record<string, string> = { // Definido tipo
                    nova_atividade: "bg-blue-50 border-l-4 border-blue-500",
                    complementacao_solicitada:
                      "bg-yellow-50 border-l-4 border-yellow-500",
                    decisao: "bg-green-50 border-l-4 border-green-500",
                    meta_atingida: "bg-purple-50 border-l-4 border-purple-500",
                  };

                  const tipoIcone: Record<string, React.ReactNode> = { // Definido tipo
                    nova_atividade: (
                      <Clock className="w-5 h-5 text-blue-500" />
                    ),
                    complementacao_solicitada: (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    ),
                    decisao: <CheckCircle className="w-5 h-5 text-green-500" />,
                    meta_atingida: (
                      <Award className="w-5 h-5 text-purple-500" />
                    ),
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

        {/* outros status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-xl font-bold text-blue-600 mb-1">12</div>
            <div className="text-xs text-gray-600">Atividades Pendentes</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-xl font-bold text-green-600 mb-1">15</div>
            <div className="text-xs text-gray-600">Atividades Aprovadas</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-xl font-bold text-yellow-600 mb-1">3</div>
            <div className="text-xs text-gray-600">Em Análise</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-xl font-bold text-purple-600 mb-1">90%</div>
            <div className="text-xs text-gray-600">Progresso Geral</div>
          </div>
        </div>
      </main>
    </div>
  );
}
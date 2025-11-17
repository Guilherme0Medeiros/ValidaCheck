"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Clock,
  MapPin,
  Calendar,
  User,
  Download, 
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import NavBar from "../../../../components/navBar";

interface Atividade {
  id: string | number;
  titulo: string;
  enviado_por: string;
  categoria_nome: string;
  categoria: number;
  horas_solicitadas: number;
  horas_concedidas: number | null;
  criado_em: string;
  data_inicio: string;
  data_fim: string;
  local: string;
  descricao: string;
  status: string;
  arquivos: { id: number; arquivo: string }[];
  feedback_secretaria?: string; 
}

export default function AtividadeDetalhesPage() {
  const { id } = useParams();
  const router = useRouter();
  const [atividade, setAtividade] = useState<Atividade | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role =
      typeof window !== "undefined" ? localStorage.getItem("role") : null;
    if (!role) {
      router.replace("/login");
    } else if (role !== "student") {
      router.replace("/login");
    } else {
      setIsLoading(false); // Só para de carregar se for um estudante
    }
  }, [router]);

  useEffect(() => {
    // Só busca os dados se o ID existir e a verificação de role tiver passado
    if (!isLoading && id) {
      api
        .get(`activities/atividades/${id}/`)
        .then((res) => {
          setAtividade(res.data);
        })
        .catch((err) => {
          console.error("Erro ao carregar detalhes:", err);
          if (err.response?.status === 403) {
            alert("Você não tem permissão para ver esta atividade.");
            router.push("/atividades");
          }
        });
    }
  }, [id, isLoading, router]);

  if (isLoading || !atividade) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Carregando...
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Enviado":
      case "Em análise":
        return "bg-blue-100 text-blue-800";
      case "Aprovado":
      case "Aprovado com ajuste":
      case "Computado":
        return "bg-green-100 text-green-800";
      case "Complementação solicitada":
        return "bg-orange-100 text-orange-800";
      case "Indeferido":
        return "bg-red-100 text-red-800";
      case "Rascunho":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link
          href="/atividades"
          className="inline-flex items-center text-blue-600 hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Atividades
        </Link>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {atividade.titulo}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                atividade.status
              )}`}
            >
              {atividade.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            {/* Coluna de Detalhes */}
            <div className="space-y-4">
              <p className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <span>
                  Categoria:{" "}
                  {atividade.categoria_nome || atividade.categoria}
                </span>
              </p>

              <p className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span>
                  Horas solicitadas: {atividade.horas_solicitadas}h
                  {/* Mostra horas concedidas se for diferente*/}
                  {atividade.horas_concedidas !== null &&
                    atividade.horas_concedidas !==
                      atividade.horas_solicitadas && (
                      <span className="text-green-700 font-medium ml-2">
                        (Concedidas: {atividade.horas_concedidas}h)
                      </span>
                    )}
                </span>
              </p>

              <p className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span>
                  {new Date(atividade.data_inicio).toLocaleDateString("pt-BR")}
                  {atividade.data_fim
                    ? ` até ${new Date(atividade.data_fim).toLocaleDateString(
                        "pt-BR"
                      )}`
                    : ""}
                </span>
              </p>

              <p className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span>Local: {atividade.local || "Não informado"}</span>
              </p>
            </div>

            {/* Coluna de Descrição */}
            <div>
              <h2 className="text-md font-semibold text-gray-900 mb-2">
                Descrição
              </h2>
              <p className="text-gray-700 whitespace-pre-line text-sm">
                {atividade.descricao || "Nenhuma descrição informada."}
              </p>
            </div>

            {/* Seção de Arquivos */}
            <div>
              <h2 className="text-md font-semibold text-gray-900 mb-2">
                Meus Documentos
              </h2>
              {atividade.arquivos && atividade.arquivos.length > 0 ? (
                <div className="space-y-2">
                  {atividade.arquivos.map((file) => (
                    <a
                      key={file.id}
                      href={file.arquivo} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>{file.arquivo.split("/").pop()}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Nenhum documento anexado.
                </p>
              )}
            </div>

            {/* Seção de Feedback */}
            {atividade.feedback_secretaria && (
              <div>
                <h2 className="text-md font-semibold text-gray-900 mb-2">
                  Feedback da Secretaria
                </h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 whitespace-pre-line">
                    {atividade.feedback_secretaria}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
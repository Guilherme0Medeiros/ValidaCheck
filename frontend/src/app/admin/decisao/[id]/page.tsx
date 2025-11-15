"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Check,
  X,
  Edit3,
  RotateCcw,
  Calendar,
  User,
  Clock,
  Download,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios"; // Importa sua instância do Axios
import NavBar from "../../../../../components/navBar"; // Importa o NavBar (caminho corrigido)

// Tipos para os dados da API
interface Atividade {
  id: string | number;
  titulo: string;
  enviado_por: string;
  categoria_nome?: string; // O serializer pode não enviar isso, ajuste conforme necessário
  categoria: number;
  horas_solicitadas: number;
  criado_em: string;
  status: string;
  arquivos: { id: number; arquivo: string }[]; // Array de arquivos
}

interface HistoricoItem {
  id: number;
  status_novo: string;
  timestamp: string;
  usuario: string;
}

export default function DecisaoPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params; // Pega o ID da atividade da URL

  // Estados para dados da API
  const [activity, setActivity] = useState<Atividade | null>(null);
  const [history, setHistory] = useState<HistoricoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Estados locais da página
  const [comentario, setComentario] = useState("");
  const [horasAjustadas, setHorasAjustadas] = useState("");
  const [showHorasInput, setShowHorasInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Para desabilitar botões

  // Efeito para buscar os dados da atividade e seu histórico
  useEffect(() => {
    if (!id) return;

    // Proteção de Rota (opcional, mas recomendado)
    const role =
      typeof window !== "undefined" ? localStorage.getItem("role") : null;
    if (role !== "secretary") {
      router.replace("/login");
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        // Busca os detalhes da atividade e o histórico em paralelo
        const [activityRes, timelineRes] = await Promise.all([
          api.get(`activities/atividades/${id}/`),
          api.get(`activities/atividades/${id}/timeline/`),
        ]);

        setActivity(activityRes.data);
        setHistory(timelineRes.data.historico || []);
      } catch (error: any) {
        console.error("Falha ao buscar dados da atividade:", error);
        if (error.response?.status === 403) {
          setErrorMessage("Você não tem permissão para ver esta atividade.");
        } else {
          setErrorMessage("Não foi possível carregar os dados da atividade.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, router]);

  // Função genérica para enviar a decisão para a API
  //
  const handleDecision = async (
    status: string,
    payload: Record<string, any>
  ) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await api.patch(`activities/atividades/${id}/decisao/`, {
        status,
        ...payload,
      });
      alert("Decisão registrada com sucesso!");
      router.push("/admin/relatorios"); // Volta para a lista
    } catch (err: any) {
      console.error("Erro ao enviar decisão:", err);
      alert(
        `Erro ao enviar decisão: ${
          err.response?.data?.detail || "Tente novamente."
        }`
      );
      setIsSubmitting(false);
    }
  };

  // --- Handlers de Ação ---

  const handleAprovar = () => {
    handleDecision("Aprovado", {
      horas_concedidas: activity?.horas_solicitadas,
      comentario: comentario || "Aprovado.",
    });
  };

  const handleAjustarHoras = () => {
    const horas = parseInt(horasAjustadas);
    if (!horas || horas <= 0 || horas > (activity?.horas_solicitadas || 0)) {
      alert(
        `Por favor, insira um valor válido de horas (entre 1 e ${activity?.horas_solicitadas}).`
      );
      return;
    }
    handleDecision("Aprovado com ajuste", {
      horas_concedidas: horas,
      comentario: comentario || `Ajustado para ${horas} horas.`,
    });
  };

  const handleIndeferir = () => {
    if (!comentario) {
      alert("Por favor, preencha o campo de comentário com a justificativa.");
      return;
    }
    handleDecision("Indeferido", {
      justificativa: comentario,
    });
  };

  const handleSolicitarComplementacao = () => {
    if (!comentario) {
      alert(
        "Por favor, preencha o campo de comentário informando o que precisa ser complementado."
      );
      return;
    }
    // O backend espera um JSON 'checklist'.
    const checklist = [comentario]; // Enviando o comentário como uma lista
    
    handleDecision("Complementação solicitada", {
      checklist: checklist,
      comentario: comentario,
    });
  };

  // --- Renderização ---

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Carregando...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 text-lg mb-4">{errorMessage}</p>
        <Link
          href="/admin/relatorios"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para relatórios</span>
        </Link>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Atividade não encontrada.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (NavBar) */}
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/admin/relatorios"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para relatórios</span>
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tela de decisão</h1>
        </div>

        {/* Report Info (Dados da API) */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {activity.titulo}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{activity.enviado_por}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Enviado em:{" "}
                    {new Date(activity.criado_em).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{activity.horas_solicitadas}h solicitadas</span>
                </div>
              </div>
            </div>
            <span
              className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${
                activity.status === "Enviado"
                  ? "bg-blue-100 text-blue-800 border-blue-200"
                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{activity.status}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Documentos (Dados da API) */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Documentos
            </h3>
            {activity.arquivos && activity.arquivos.length > 0 ? (
              <div className="space-y-3">
                {activity.arquivos.map((file) => (
                  <div
                    key={file.id}
                    className="border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <FileText className="w-6 h-6 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">
                        {file.arquivo.split("/").pop() || "Documento"}
                      </span>
                    </div>
                    <a
                      href={file.arquivo} // Link direto para o arquivo
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>Baixar</span>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600">
                  Nenhum documento enviado.
                </p>
              </div>
            )}
          </div>

          {/* Comment Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Comentário / Justificativa
            </h3>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Adicione seus comentários, justificativa (para indeferir) ou o que precisa ser complementado..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />

            {showHorasInput && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horas aprovadas
                </label>
                <input
                  type="number"
                  value={horasAjustadas}
                  onChange={(e) => setHorasAjustadas(e.target.value)}
                  placeholder={`Máximo: ${activity.horas_solicitadas}h`}
                  max={activity.horas_solicitadas}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* History (Dados da API) */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico</h3>
          <div className="space-y-4">
            {history.length > 0 ? (
              history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        item.status_novo.includes("Aprovado")
                          ? "bg-green-500"
                          : item.status_novo.includes("Complementação")
                          ? "bg-orange-500"
                          : item.status_novo.includes("Enviado")
                          ? "bg-blue-500"
                          : item.status_novo.includes("Indeferido")
                          ? "bg-red-500"
                          : "bg-gray-400"
                      }`}
                    ></div>
                    <span className="text-sm font-medium text-gray-900">
                      {item.status_novo}
                    </span>
                    <span className="text-sm text-gray-500">
                      (por {item.usuario || "Sistema"})
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {new Date(item.timestamp).toLocaleString("pt-BR")}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                Nenhum histórico registrado para esta atividade.
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleAprovar}
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            <Check className="w-5 h-5" />
            <span>{isSubmitting ? "Aprovando..." : "Aprovar"}</span>
          </button>

          <button
            onClick={() => setShowHorasInput(!showHorasInput)}
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            <Edit3 className="w-5 h-5" />
            <span>{showHorasInput ? "Cancelar Ajuste" : "Ajustar horas"}</span>
          </button>

          {showHorasInput && (
            <button
              onClick={handleAjustarHoras}
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors disabled:bg-gray-400"
            >
              <Check className="w-5 h-5" />
              <span>{isSubmitting ? "Salvando..." : "Confirmar ajuste"}</span>
            </button>
          )}

          <button
            onClick={handleIndeferir}
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
          >
            <X className="w-5 h-5" />
            <span>{isSubmitting ? "Indeferindo..." : "Indeferir"}</span>
          </button>

          <button
            onClick={handleSolicitarComplementacao}
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400"
          >
            <RotateCcw className="w-5 h-5" />
            <span>
              {isSubmitting ? "Solicitando..." : "Solicitar complementação"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
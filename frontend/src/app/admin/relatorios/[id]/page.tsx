"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Check,
  X,
  RotateCcw,
  Calendar,
  User,
  Clock,
  Download,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import NavBar from "../../../../../components/navBar";

interface Relatorio {
  id: number;
  titulo: string;
  descricao: string;
  arquivo: string;
  status: string;
  enviado_por: number | string;
  enviado_por_nome?: string;
  criado_em: string;
  atividade_titulo?: string;
  justificativa?: string | null;
  checklist?: string[] | null;
}

interface HistoricoItem {
  id: number;
  status_novo: string;
  timestamp: string;
  usuario_nome?: string;
  comentario?: string;
}

export default function DecisaoRelatorioPage() {
  const { id } = useParams();
  const router = useRouter();

  const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
  const [history, setHistory] = useState<HistoricoItem[]>([]);
  const [comentario, setComentario] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // =============================
  // PROTEÇÃO DE ROTA
  // =============================
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "secretary") {
      router.replace("/login");
    }
  }, [router]);

  // =============================
  // CARREGAR RELATÓRIO + HISTÓRICO
  // =============================
  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        const [relRes, histRes] = await Promise.all([
          api.get(`/activities/relatorios/${id}/`),
          api.get(`/activities/relatorios/${id}/timeline/`).catch(() => ({
            data: { historico: [] },
          })),
        ]);

        setRelatorio(relRes.data);
        setHistory(histRes.data.historico || []);
      } catch (err) {
        setErrorMessage("Erro ao carregar dados do relatório.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id]);

  // =============================
  // DECISÕES DO ADMIN (PATCH CORRETO)
  // =============================
  async function handleDecision(status: string, payload: any = {}) {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await api.patch(`/activities/relatorios/${id}/decisao/`, {
        status,
        ...payload,
      });

      alert("Decisão registrada com sucesso!");
      router.push("/admin/relatorios");
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar decisão.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleAprovar = () => {
    handleDecision("Aprovado", {
      comentario: comentario || "Relatório aprovado.",
    });
  };

  const handleIndeferir = () => {
    if (!comentario) {
      alert("Escreva uma justificativa para indeferir.");
      return;
    }
    handleDecision("Indeferido", { justificativa: comentario });
  };

  const handleComplementacao = () => {
    if (!comentario) {
      alert("Descreva o que precisa ser complementado.");
      return;
    }
    handleDecision("Complementação solicitada", { checklist: [comentario] });
  };

  // =============================
  // CARREGAMENTO
  // =============================
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!relatorio) {
    return <div className="min-h-screen flex items-center justify-center">Relatório não encontrado.</div>;
  }

  // =============================
  // COMPONENTE PRINCIPAL
  // =============================
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* VOLTAR */}
        <Link
          href="/admin/relatorios"
          className="inline-flex items-center text-blue-600 hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>

        {/* TÍTULO */}
        <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{relatorio.titulo}</h1>

              {/* DESCRIÇÃO DO ALUNO */}
              {relatorio.descricao && (
                <p className="text-gray-700 mt-3">
                  <strong>Descrição enviada pelo aluno:</strong><br />
                  {relatorio.descricao}
                </p>
              )}

              <p className="text-gray-600 mt-3">
                Referente à atividade: <strong>{relatorio.atividade_titulo}</strong>
              </p>

              <div className="mt-2 flex gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {relatorio.enviado_por_nome || "Aluno"}
                </span>

                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(relatorio.criado_em).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>

            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {relatorio.status}
            </span>
          </div>

          {/* ARQUIVO */}
          <div className="mt-6">
            <h2 className="font-semibold text-gray-800 mb-1">Arquivo enviado:</h2>

            <a
              href={relatorio.arquivo}
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Download className="w-4 h-4" />
              Baixar arquivo
            </a>
          </div>
        </div>

        {/* JUSTIFICATIVA / COMPLEMENTAÇÃO DO SISTEMA */}
        <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
          {relatorio.checklist && relatorio.status === "Complementação solicitada" && (
            <div className="mb-4 bg-orange-50 p-4 rounded-lg border border-orange-200 flex gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-1" />
              <div>
                <p className="font-medium text-orange-700">Complementação solicitada anteriormente:</p>
                <p className="text-orange-700 text-sm mt-1">{relatorio.checklist.join(", ")}</p>
              </div>
            </div>
          )}

          {relatorio.justificativa && relatorio.status === "Indeferido" && (
            <div className="mb-4 bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
              <p><strong>Justificativa do indeferimento:</strong> {relatorio.justificativa}</p>
            </div>
          )}

          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Escreva aqui o comentário do admin..."
            className="w-full h-32 border p-3 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* BOTÕES DE DECISÃO */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleAprovar}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            disabled={isSubmitting}
          >
            <Check className="w-4 h-4 inline mr-2" />
            Aprovar
          </button>

          <button
            onClick={handleIndeferir}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            disabled={isSubmitting}
          >
            <X className="w-4 h-4 inline mr-2" />
            Indeferir
          </button>

          <button
            onClick={handleComplementacao}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
            disabled={isSubmitting}
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            Solicitar complementação
          </button>
        </div>

        {/* HISTÓRICO */}
        <div className="bg-white p-6 rounded-lg border shadow-sm mt-10">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Histórico do relatório</h3>

          {history.length === 0 && (
            <p className="text-gray-500 text-sm">Nenhum histórico registrado.</p>
          )}

          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="flex justify-between border-b pb-2 text-sm">
                <span>
                  <strong>{item.status_novo}</strong> — por {item.usuario_nome || "Sistema"}
                  {item.comentario ? ` — ${item.comentario}` : ""}
                </span>
                <span>{new Date(item.timestamp).toLocaleString("pt-BR")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

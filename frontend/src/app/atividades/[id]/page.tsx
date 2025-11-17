"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Clock,
  MapPin,
  Calendar,
  User,
  Download,
  AlertCircle,
  Upload,
  Save,
  Tag, 
  X, 
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import NavBar from "../../../../components/navBar"; 

interface Categoria {
  id: number;
  nome: string;
}

interface Atividade {
  id: string | number;
  titulo: string;
  enviado_por: string;
  categoria: number;
  categoria_nome: string;
  horas_solicitadas: number;
  horas_concedidas: number | null;
  criado_em: string;
  data_inicio: string;
  data_fim: string;
  local: string;
  descricao: string;
  status: string;
  arquivos: { id: number; arquivo: string }[];
  justificativa: string | null;
  checklist: any | null; 
  vinculo?: string;
  observacoes?: string;
}

type FormDataState = {
  titulo: string;
  categoria: string; 
  descricao: string;
  local: string;
  data_inicio: string;
  data_fim: string;
  horas_solicitadas: string;
  vinculo: string;
  observacoes: string;
};

export default function AtividadeDetalhesPage() {
  const { id } = useParams();
  const router = useRouter();

  // Estados
  const [atividade, setAtividade] = useState<Atividade | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [formData, setFormData] = useState<FormDataState | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const role =
      typeof window !== "undefined" ? localStorage.getItem("role") : null;
    if (!role) {
      router.replace("/login");
      return; 
    } else if (role !== "student") {
      router.replace("/login");
      return; 
    }

    if (!id) return;

    async function fetchData() {
      try {
        const [activityRes, categoriesRes] = await Promise.all([
          api.get(`activities/atividades/${id}/`),
          api.get("activities/categorias/"), 
        ]);

        const activityData: Atividade = activityRes.data;
        setAtividade(activityData);

        // Garante que categoriesRes.data é um array
        const cats = Array.isArray(categoriesRes.data) 
          ? categoriesRes.data 
          : categoriesRes.data.results || [];
        setCategorias(cats);

        // Se o status for "Complementação solicitada", ative o modo de edição
        if (activityData.status === "Complementação solicitada") {
          setIsEditing(true);
          // Preenche o formulário com os dados existentes
          setFormData({
            titulo: activityData.titulo || "",
            categoria: String(activityData.categoria || ""),
            descricao: activityData.descricao || "",
            local: activityData.local || "",
            data_inicio: activityData.data_inicio?.split("T")[0] || "",
            data_fim: activityData.data_fim?.split("T")[0] || "",
            horas_solicitadas: String(activityData.horas_solicitadas || ""),
            vinculo: activityData.vinculo || "", 
            observacoes: activityData.observacoes || "",
          });
        }
      } catch (err: any) {
        console.error("Erro ao carregar detalhes:", err);
        if (err.response?.status === 403) {
          alert("Você não tem permissão para ver esta atividade.");
          router.push("/atividades");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, router]);

  // Handlers do Formulário
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsSubmitting(true);

    const data = new FormData();
    data.append("titulo", formData.titulo);
    data.append("categoria", formData.categoria);
    data.append("descricao", formData.descricao);
    data.append("local", formData.local);
    data.append("data_inicio", formData.data_inicio);
    data.append("data_fim", formData.data_fim);
    data.append("horas_solicitadas", formData.horas_solicitadas);
    data.append("vinculo", formData.vinculo);
    data.append("observacoes", formData.observacoes);
    data.append("status", "Enviado");

    uploadedFiles.forEach((file) => {
      data.append("novos_arquivos", file);
    });

    try {
      await api.patch(`activities/atividades/${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Atividade atualizada e reenviada para análise!");
      router.push("/atividades");
    } catch (err) {
      console.error("Erro ao atualizar atividade:", err);
      alert("Falha ao atualizar. Verifique os campos e tente novamente.");
      setIsSubmitting(false);
    }
  };


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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderFeedback = () => {
    if (
      atividade.status === "Complementação solicitada" &&
      atividade.checklist
    ) {
      let feedback = "Motivo não especificado.";
      // O checklist pode ser um array ou um objeto, dependendo de como o admin enviou
      if (Array.isArray(atividade.checklist) && atividade.checklist.length > 0) {
        feedback = atividade.checklist.join(", ");
      } else if (
        typeof atividade.checklist === "object" &&
        atividade.checklist.solicitacao
      ) {
        feedback = atividade.checklist.solicitacao;
      }

      return (
        <div className="mb-6 bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Complementação Solicitada</h2>
          </div>
          <p className="mt-2 text-sm">
            A secretaria solicitou ajustes: <strong>{feedback}</strong>
          </p>
          <p className="mt-1 text-sm">
            Por favor, edite os campos abaixo e anexe novos documentos se
            necessário.
          </p>
        </div>
      );
    }
    if (atividade.status === "Indeferido" && atividade.justificativa) {
      return (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <X className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Atividade Indeferida</h2>
          </div>
          <p className="mt-2 text-sm">
            Motivo: <strong>{atividade.justificativa}</strong>
          </p>
        </div>
      );
    }
    return null;
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

        {/* Mostra o feedback */}
        {renderFeedback()}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-gray-200 shadow-sm p-8"
        >
          <div className="flex items-center justify-between mb-6">
            {isEditing ? (
              <input
                type="text"
                name="titulo"
                value={formData?.titulo}
                onChange={handleInputChange}
                className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:border-blue-500 outline-none w-full"
                placeholder="Título da atividade"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900">
                {atividade.titulo}
              </h1>
            )}
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                atividade.status
              )}`}
            >
              {atividade.status}
            </span>
          </div>

          <div className="space-y-6">
            {/* Categoria */}
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-gray-500" />
              {isEditing ? (
                <select
                  name="categoria"
                  value={formData?.categoria}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Selecione a categoria</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
              ) : (
                <span>Categoria: {atividade.categoria_nome}</span>
              )}
            </div>

            {/* Horas */}
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-500" />
              {isEditing ? (
                <input
                  type="number"
                  name="horas_solicitadas"
                  value={formData?.horas_solicitadas}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Horas solicitadas"
                />
              ) : (
                <span>
                  Horas solicitadas: {atividade.horas_solicitadas}h
                  {atividade.horas_concedidas !== null &&
                    atividade.horas_concedidas !==
                      atividade.horas_solicitadas && (
                      <span className="text-green-700 font-medium ml-2">
                        (Concedidas: {atividade.horas_concedidas}h)
                      </span>
                    )}
                </span>
              )}
            </div>

            {/* Datas */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              {isEditing ? (
                <div className="flex gap-4 w-full">
                  <input
                    type="date"
                    name="data_inicio"
                    value={formData?.data_inicio}
                    onChange={handleInputChange}
                    className="w-1/2 p-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="date"
                    name="data_fim"
                    value={formData?.data_fim}
                    onChange={handleInputChange}
                    className="w-1/2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              ) : (
                <span>
                  {new Date(atividade.data_inicio).toLocaleDateString("pt-BR")}
                  {atividade.data_fim
                    ? ` até ${new Date(atividade.data_fim).toLocaleDateString(
                        "pt-BR"
                      )}`
                    : ""}
                </span>
              )}
            </div>

            {/* Local */}
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              {isEditing ? (
                <input
                  type="text"
                  name="local"
                  value={formData?.local}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Local"
                />
              ) : (
                <span>Local: {atividade.local || "Não informado"}</span>
              )}
            </div>

            {/* Descrição */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Descrição
              </h2>
              {isEditing ? (
                <textarea
                  name="descricao"
                  value={formData?.descricao}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg h-24 resize-none"
                  placeholder="Descrição da atividade"
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-line">
                  {atividade.descricao || "Nenhuma descrição informada."}
                </p>
              )}
            </div>

            {/* Documentos */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Documentos
              </h2>
              {/* Mostra arquivos existentes */}
              {atividade.arquivos && atividade.arquivos.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-gray-600">
                    Arquivos atuais:
                  </p>
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
              )}

              {/* Input de novos arquivos só no modo de edição */}
              {isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anexar novos documentos (opcional)
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500
                               file:mr-4 file:py-2 file:px-4
                               file:rounded-lg file:border-0
                               file:text-sm file:font-semibold
                               file:bg-blue-50 file:text-blue-700
                               hover:file:bg-blue-100"
                  />
                  {uploadedFiles.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Novos arquivos:</p>
                      <ul className="list-disc pl-5">
                        {uploadedFiles.map((f) => (
                          <li key={f.name}>{f.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Botão de Salvar */}
            {isEditing && (
              <div className="mt-8 border-t pt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  <Save className="w-5 h-5" />
                  <span>
                    {isSubmitting
                      ? "Salvando..."
                      : "Salvar e Reenviar para Análise"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
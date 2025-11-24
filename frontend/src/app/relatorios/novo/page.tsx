"use client";

import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { FileText, Upload, Tag, ClipboardCheck } from "lucide-react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function NovoRelatorio() {
  const router = useRouter();

  const [atividades, setAtividades] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    atividade: "",
    titulo: "",
    descricao: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔵 Carregar atividades aprovadas para listar no select
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/activities/atividades/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const todas = res.data.results || res.data;

        // Apenas atividades aprovadas ou aprovadas com ajuste
        const aprovadas = todas.filter(
          (a: any) =>
            a.status === "Aprovado" || a.status === "Aprovado com ajuste"
        );

        setAtividades(aprovadas);
      })
      .catch((err) =>
        console.error("❌ Erro ao carregar atividades aprovadas:", err)
      );
  }, [router]);

  // 🔵 Atualização dos inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔵 Upload
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // 🔵 Envio do relatório
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("atividade", formData.atividade);
      data.append("titulo", formData.titulo);
      data.append("descricao", formData.descricao);

      if (file) {
        data.append("arquivo", file);
      }

      const token = localStorage.getItem("access_token");

      await api.post("/activities/relatorios/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      router.push("/relatorios");
    } catch (err) {
      console.error("❌ Erro ao enviar relatório:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Enviar novo relatório
        </h1>
        <p className="text-gray-600 mb-8">
          Anexe o relatório referente a uma atividade já aprovada.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Selecionar atividade */}
            <div>
              <label
                htmlFor="atividade"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <ClipboardCheck className="w-4 h-4 inline mr-2" />
                Atividade concluída
              </label>

              <select
                id="atividade"
                name="atividade"
                value={formData.atividade}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Selecione uma atividade</option>

                {atividades.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.titulo} — {a.horas_concedidas}h ({a.categoria_nome})
                  </option>
                ))}
              </select>
            </div>

            {/* Título */}
            <div>
              <label
                htmlFor="titulo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Título do relatório
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                placeholder="Ex: Relatório final do projeto"
                value={formData.titulo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Descrição */}
            <div className="lg:col-span-2">
              <label
                htmlFor="descricao"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Tag className="w-4 h-4 inline mr-2" />
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                rows={4}
                placeholder="Descreva brevemente o conteúdo do relatório"
                value={formData.descricao}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>

            {/* Upload */}
            <div className="lg:col-span-2">
              <label
                htmlFor="arquivo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Arquivo do relatório
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="arquivo"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFile}
                  className="hidden"
                />
                <label
                  htmlFor="arquivo"
                  className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clique para selecionar o arquivo
                </label>

                {file && (
                  <p className="text-gray-700 text-sm mt-3">
                    📄 {file.name}
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Botão */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium 
              py-3 px-8 rounded-lg transition-colors"
            >
              {loading ? "Enviando..." : "Enviar relatório"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

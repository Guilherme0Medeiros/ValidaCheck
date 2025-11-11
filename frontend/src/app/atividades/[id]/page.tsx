"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, Clock, MapPin, Calendar, User } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import NavBar from "../../../components/Header";

export default function AtividadeDetalhesPage() {
  const { id } = useParams();
  const [atividade, setAtividade] = useState<any>(null);

  useEffect(() => {
    api
      .get(`activities/atividades/${id}/`)
      .then((res) => setAtividade(res.data))
      .catch((err) => console.error("Erro ao carregar detalhes:", err));
  }, [id]);

  if (!atividade)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Carregando...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link
          href="/estudante/atividades"
          className="inline-flex items-center text-blue-600 hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {atividade.titulo}
            </h1>
            <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 font-medium">
              {atividade.status}
            </span>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-500" />
              <span>Enviado por: {atividade.enviado_por}</span>
            </p>

            <p className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gray-500" />
              <span>Categoria: {atividade.categoria_nome || atividade.categoria}</span>
            </p>

            <p className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span>
                Horas solicitadas: {atividade.horas_solicitadas}h
                {atividade.horas_concedidas
                  ? ` / Concedidas: ${atividade.horas_concedidas}h`
                  : ""}
              </span>
            </p>

            <p className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span>
                {atividade.data_inicio} até {atividade.data_fim || "—"}
              </span>
            </p>

            <p className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span>Local: {atividade.local || "Não informado"}</span>
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Descrição
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {atividade.descricao || "Nenhuma descrição informada."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

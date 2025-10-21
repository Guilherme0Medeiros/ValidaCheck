"use client";

import { ArrowLeft, FileText, Clock, Calendar, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TelaDecisao() {
const router = useRouter();

// Dados estáticos — substituir futuramente pelos dados vindos da API
const atividade = {
titulo: "Participação em congresso",
nome: "João Vitor",
data: "10/04/2024",
horas: "16h solicitadas",
};

const historico = [
{ status: "Enviado", data: "10 de abril de 2024", cor: "bg-blue-500" },
{
    status: "Solicitar complementação",
    data: "15 de abril de 2024",
    cor: "bg-amber-500",
},
{ status: "Enviado", data: "15 de abril de 2024", cor: "bg-blue-500" },
];

return (
<div className="min-h-screen bg-gray-50">
    <div className="bg-gray-100 border-b border-gray-200 p-4">
    <button
        onClick={() => router.back()}
        className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
    >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Voltar para relatórios
    </button>
    </div>

    <div className="max-w-6xl mx-auto p-6">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Tela de decisão
    </h1>

    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
        {atividade.titulo}
        </h2>
        <div className="flex flex-wrap items-center gap-5 text-gray-600 text-sm">
        <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {atividade.nome}
        </div>
        <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {atividade.data}
        </div>
        <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {atividade.horas}
        </div>
        </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Documento
        </h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center h-56">
            <FileText className="w-10 h-10 text-gray-400 mb-3" />
            <p className="text-gray-600 mb-3">PDF</p>
            <button
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-5 rounded-md transition-colors"
            onClick={() => alert("Baixando documento...")}
            >
            Baixar documento
            </button>
        </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Comentário
        </h3>
        <textarea
            placeholder="Adicione seus comentários sobre o relatório..."
            className="w-full h-56 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
        </div>
    </div>

    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Histórico
        </h3>

        <ul className="space-y-3">
        {historico.map((item, index) => (
            <li key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span
                className={`w-2.5 h-2.5 rounded-full ${item.cor}`}
                ></span>
                <span className="text-gray-800 text-sm">{item.status}</span>
            </div>
            <span className="text-gray-600 text-sm">{item.data}</span>
            </li>
        ))}
        </ul>
    </div>
    </div>
</div>
);
}

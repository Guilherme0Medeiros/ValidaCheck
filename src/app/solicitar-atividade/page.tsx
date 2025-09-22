"use client";

import type React from "react";

import { useState } from "react";
import {
  Calendar,
  Upload,
  FileText,
  Clock,
  MapPin,
  Tag,
  User,
} from "lucide-react";

export default function SolicitarAtividade() {
  const [formData, setFormData] = useState({
    categoria: "",
    titulo: "",
    local: "",
    dataInicio: "",
    dataTermino: "",
    vinculo: "",
    horasSolicitadas: "",
    observacoes: "",
    descricao: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    console.log("Files:", uploadedFiles);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Solicitar nova atividade
          </h1>
          <p className="text-gray-600">
            Preencha os dados da atividade que deseja solicitar para análise
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Categoria */}
              <div>
                <label
                  htmlFor="categoria"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <Tag className="w-4 h-4 inline mr-2" />
                  Tipo/Categoria
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="pesquisa">Pesquisa</option>
                  <option value="extensao">Extensão</option>
                  <option value="monitoria">Monitoria</option>
                  <option value="ensino">Ensino</option>
                  <option value="evento">Evento</option>
                </select>
              </div>

              {/* Título */}
              <div>
                <label
                  htmlFor="titulo"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  Título da atividade
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  placeholder="Digite o título da atividade"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {/* Local */}
              <div>
                <label
                  htmlFor="local"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Local
                </label>
                <input
                  type="text"
                  id="local"
                  name="local"
                  value={formData.local}
                  onChange={handleInputChange}
                  placeholder="Local onde a atividade foi realizada"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {/* Datas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="dataInicio"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Data de início
                  </label>
                  <input
                    type="date"
                    id="dataInicio"
                    name="dataInicio"
                    value={formData.dataInicio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="dataTermino"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Data de término
                  </label>
                  <input
                    type="date"
                    id="dataTermino"
                    name="dataTermino"
                    value={formData.dataTermino}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Horas Solicitadas */}
              <div>
                <label
                  htmlFor="horasSolicitadas"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <Clock className="w-4 h-4 inline mr-2" />
                  Horas solicitadas
                </label>
                <input
                  type="number"
                  id="horasSolicitadas"
                  name="horasSolicitadas"
                  value={formData.horasSolicitadas}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="1"
                  max="200"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Vínculo */}
              <div>
                <label
                  htmlFor="vinculo"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Vínculo
                </label>
                <input
                  type="text"
                  id="vinculo"
                  name="vinculo"
                  value={formData.vinculo}
                  onChange={handleInputChange}
                  placeholder="Projeto/evento relacionado"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {/* Descrição */}
              <div>
                <label
                  htmlFor="descricao"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  Descrição da atividade
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descreva detalhadamente a atividade realizada"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  required
                />
              </div>

              {/* Upload */}
              <div>
                <label
                  htmlFor="uploads"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Documentos comprobatórios
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    id="uploads"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="uploads"
                    className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clique para selecionar arquivos
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    PDF, DOC, DOCX, JPG, PNG (máx. 10MB cada)
                  </p>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-3 text-left">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Arquivos selecionados:
                      </p>
                      {uploadedFiles.map((file, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          • {file.name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Observações */}
              <div>
                <label
                  htmlFor="observacoes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  Observações
                </label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  placeholder="Informações adicionais ou observações relevantes"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Enviar nova atividade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

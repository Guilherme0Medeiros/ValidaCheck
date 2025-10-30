"use client";

import React, { useState } from "react";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("access");

      const response = await axios.post(
        "http://localhost:8000/api/v1/users/change-password/",
        {
          old_password: oldPassword,
          new_password1: newPassword1,
          new_password2: newPassword2,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Senha alterada com sucesso! Faça login novamente.");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      setTimeout(() => {
        router.push("/"); // volta pro login
      }, 2000);
    } catch (error: any) {
      if (error.response?.data) {
        const errors = Object.values(error.response.data).flat().join(" ");
        setMessage(errors);
      } else {
        setMessage("Erro ao trocar a senha.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Cabeçalho */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-500 rounded-lg flex items-center justify-center mb-6">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Alterar senha
          </h2>
          <p className="text-gray-600">Atualize sua senha de forma segura</p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha atual
              </label>
              <input
                type="password"
                placeholder="Digite sua senha atual"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nova senha
              </label>
              <input
                type="password"
                placeholder="Digite a nova senha"
                value={newPassword1}
                onChange={(e) => setNewPassword1(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar nova senha
              </label>
              <input
                type="password"
                placeholder="Confirme a nova senha"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {loading ? "Salvando..." : "Alterar senha"}
            </button>
          </form>

          {message && (
            <p
              className={`text-sm mt-4 text-center ${
                message.includes("sucesso") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

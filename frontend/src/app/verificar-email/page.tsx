"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function EmailVerifiedPage() {
  const params = useSearchParams();
  const status = params?.get("status") ?? "success";

  let title = "Email verificado com sucesso!";
  let message = "Agora você já pode fazer login na plataforma.";
  if (status === "expired") {
    title = "Token expirado";
    message = "O link de verificação expirou. Solicite um novo e-mail de verificação.";
  } else if (status === "invalid") {
    title = "Link inválido";
    message = "O link de verificação é inválido.";
  } else if (status === "error") {
    title = "Erro";
    message = "Ocorreu um erro. Tente novamente.";
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md">
        <h1 className="text-2xl font-bold text-green-600 mb-4">{title}</h1>
        <p className="text-gray-700 mb-6">{message}</p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          Fazer Login
        </Link>
      </div>
    </div>
  );
}

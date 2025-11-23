"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const uid = params.get("uid") || "";
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/password-reset-confirm/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, token, new_password: password }),
    });
    const data = await res.json();
    if (res.ok) setMsg("Senha alterada com sucesso. Faça login.");
    else setMsg(data.detail || "Erro");
  }

  return (
    <div>
      <h1>Redefinir senha</h1>
      <form onSubmit={submit}>
        <input type="password" placeholder="Nova senha" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Enviar</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}

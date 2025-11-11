"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";

export default function useNotificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    try {
      const res = await api.get("activities/notificacoes/");
      console.log("✅ RESPOSTA DA API:", res.data);
      setNotificacoes(res.data.results || []);
    } catch (err) {
      console.error("❌ ERRO AO CARREGAR NOTIFICAÇÕES:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
    const interval = setInterval(carregar, 30000);
    return () => clearInterval(interval);
  }, []);

  console.log("📦 STATE NOTIFICAÇÕES:", notificacoes);
  return { notificacoes, loading };
}

"use client";

import api from "@/lib/axios";

export async function login(email: string, password: string) {
    try {
        const response = await api.post("token/", {
            email,
            password,
        });

        const { access, refresh, role } = response.data;

        // Guarda tokens
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        localStorage.setItem("role", role);

        // Redireciona conforme o papel
        if (role === "secretary") {
            window.location.href = "/secretaria";
        } else {
            window.location.href = "/estudante";
        }
    } catch (error) {
        alert("E-mail ou Senha inválidos")
    }
}
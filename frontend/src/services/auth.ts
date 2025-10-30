"use client";

import api from "@/lib/axios";

export async function login(email: string, password: string) {
    try {
        const response = await api.post("users/token/", {
            email,
            password,
        });
        console.log("resposta da API",response.data)

        const { access, refresh, role, username } = response.data;

        // Guarda tokens
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh", refresh);
        localStorage.setItem("role", role);
        localStorage.setItem("username", username);

        return role;
    } catch (error) {
        alert("E-mail ou Senha inválidos")
    }
}

export function logout() {
    // Limpar tudo do localStorege para realizar o logout
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    // Redireciona para login
    window.location.href = '/login';
}
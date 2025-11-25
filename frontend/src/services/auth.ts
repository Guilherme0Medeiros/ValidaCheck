"use client";

import api from "@/lib/axios";

export async function login(email: string, password: string) {
    try {
        const response = await api.post("users/token/", {
            email,
            password,
        });
        console.log("resposta da API",response.data)

        const { access, refresh, role, username, email: userEmail } = response.data;

        // Guarda tokens
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh", refresh);
        localStorage.setItem("role", role);
        localStorage.setItem("username", username);
        localStorage.setItem("email", userEmail)

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

export async function socialLoginJWT() {
  try {
    const response = await api.get("users/social-login-jwt/");
    const { access, refresh, username, role } = response.data;

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);

    return role;
  } catch (error) {
    console.error("Erro ao pegar JWT do social login:", error);
    return null;
  }
}

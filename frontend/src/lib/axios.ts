import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/"
})

// Interceptador para adicionar o token automaticamente nas requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    const publicPaths = ['auth/register/', 'auth/login/'];  // Rotas públicas sem token

    const isPublic = publicPaths.some(path => config.url?.includes(path));

    if (token && !isPublic) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
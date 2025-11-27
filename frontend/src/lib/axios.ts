import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/",
    withCredentials: true,
});

// Interceptador para adicionar o token automaticamente nas requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    
    const publicPaths = ['users/register/', 'users/token/']; 

    const isPublic = publicPaths.some(path => config.url?.includes(path));

    if (token && !isPublic) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//  REMOVIDO O SEGUNDO INTERCEPTADOR QUE ESTAVA AQUI E DUPLICAVA A LÓGICA

// Interceptor de response para lidar com refresh token automaticamente
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refresh_token");
                if (!refreshToken) {
                    throw new Error("Sem refresh token");
                }
                // Certifique-se que a URL de refresh está correta
                const res = await axios.post("http://127.0.0.1:8000/api/v1/users/token/refresh/", { refresh: refreshToken });
                
                localStorage.setItem("access_token", res.data.access);
                originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
                return api(originalRequest);
            } catch (err) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("role");
                localStorage.removeItem("username");
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
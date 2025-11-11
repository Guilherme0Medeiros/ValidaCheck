import axios from "axios";

const api = axios.create({
baseURL: "http://127.0.0.1:8000/api/v1/",
});

api.interceptors.request.use(
(config) => {
const token = localStorage.getItem("access_token");  
if (token) {
    config.headers.Authorization = `Bearer ${token}`;
}
return config;
},
(error) => Promise.reject(error)
);

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
    const res = await axios.post("http://127.0.0.1:8000/api/v1/users/token/refresh/", { refresh: refreshToken });
    localStorage.setItem("access_token", res.data.access);  // Atualiza o access_token
    originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
    return api(originalRequest);  // Repete a requisição original com o novo token
    } catch (err) {
    // Falha no refresh: Limpa o storage e redireciona para login
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    window.location.href = "/login";  // Redireciona para página de login
    return Promise.reject(err);
    }
}
return Promise.reject(error);
}
);

export default api;
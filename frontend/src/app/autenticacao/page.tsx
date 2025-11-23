import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function GoogleCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const fetchJWT = async () => {
            try {
            const response = await api.get("users/social-login-jwt/", { withCredentials: true });
            const { access, refresh, username, role } = response.data;

            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);
            localStorage.setItem("username", username);
            localStorage.setItem("role", role);

            // redireciona para a página do usuário
            router.push("/estudante"); 
            } catch (err) {
            router.push("/login");
            }
        };

        fetchJWT();
    }, []);


  return <p>Carregando...</p>;
}

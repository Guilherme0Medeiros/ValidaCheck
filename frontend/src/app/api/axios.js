import axios from "axios";

async function login(email, password) {
    try {
        const response = await axios.post("http://localhost:8000/api/token", {
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
            window.location.href = "/secretary";
        } else {
            window.location.href = "/student";
        }
    } catch (error) {
        alert("E-mail ou Senha inválidos")
    }
}
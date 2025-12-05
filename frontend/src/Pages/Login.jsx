import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const navigate = useNavigate();

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/login/",
                {
                    correo: correo,
                    password: password
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const { token, refresh, usuario } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("refresh", refresh);
            localStorage.setItem("currentUser", JSON.stringify(usuario));
            localStorage.setItem("userId", usuario.id_usuario);

            navigate("/dashboard");

        } catch (err) {
            console.error(" Error login:", err);

            if (err.response?.status === 401) {
                setError("Credenciales inválidas");
            } else {
                setError("Error al iniciar sesión.");
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2>Iniciar Sesión</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label>Correo:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    Entrar
                </button>
            </form>
        </div>
    );
}

export default Login;

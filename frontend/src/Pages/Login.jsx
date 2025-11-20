import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; // asegúrate de que exista src/services/api.js

export default function Login() {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!correo || !password) {
            setError("Correo y contraseña son obligatorios.");
            return;
        }

        setLoading(true);
        try {
            // Llamada al endpoint de login de tu backend
            const res = await API.post("login/", { correo, password });
            // Respuesta esperada:
            // { token: "...", usuario: { id_usuario: 1, nombre: "...", correo: "..." } }

            const { token, usuario } = res.data;

            if (!token || !usuario || usuario.id_usuario == null) {
                setError("Respuesta inválida del servidor. Revisa el backend.");
                setLoading(false);
                return;
            }

            // Guardar en localStorage exactamente estas claves:
            localStorage.setItem("token", token);
            localStorage.setItem("userId", String(usuario.id_usuario));
            localStorage.setItem("currentUser", JSON.stringify(usuario));

            // Redirigir al dashboard
            navigate("/dashboard");
        } catch (err) {
            console.error("Login error:", err);
            // Mensaje claro si el backend devuelve 401 o similar
            if (err?.response?.status === 401) {
                setError("Credenciales inválidas.");
            } else {
                setError("Error de red al intentar iniciar sesión.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: 480 }}>
            <h2>Iniciar sesión</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input
                        type="email"
                        className="form-control"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        placeholder="tu@correo.com"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>

                <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </div>
    );
}

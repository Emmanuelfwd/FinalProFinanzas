import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/login.css";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        correo: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.correo || !form.password) {
            setError("Debe completar todos los campos.");
            return;
        }

        setLoading(true);

        try {
            const res = await API.post("login/", {
                correo: form.correo,
                password: form.password
            });

            const { token, usuario } = res.data;

            if (!token || !usuario) {
                setError("Respuesta inválida del servidor.");
                setLoading(false);
                return;
            }

            // Guardar sesión
            localStorage.setItem("token", token);
            localStorage.setItem("userId", usuario.id_usuario);
            localStorage.setItem("currentUser", JSON.stringify(usuario));

            navigate("/dashboard");

        } catch (err) {
            if (err.response?.status === 401) {
                setError("Correo o contraseña incorrectos.");
            } else {
                setError("Error de conexión con el servidor.");
            }
        }

        setLoading(false);
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">

                <h2 className="auth-title">Iniciar sesión</h2>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>

                    <label>Correo electrónico</label>
                    <input
                        type="email"
                        name="correo"
                        value={form.correo}
                        onChange={handleChange}
                        className="auth-input"
                        placeholder="tu@correo.com"
                    />

                    <label>Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="auth-input"
                        placeholder="••••••••"
                    />

                    <button className="auth-button" disabled={loading}>
                        {loading ? "Ingresando..." : "Entrar"}
                    </button>
                </form>

                <p className="auth-switch">
                    ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
                </p>
            </div>
        </div>
    );
}

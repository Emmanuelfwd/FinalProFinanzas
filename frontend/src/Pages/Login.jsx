import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/visual.css";

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
        { correo, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, refresh, usuario } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("currentUser", JSON.stringify(usuario));
      localStorage.setItem("userId", usuario.id_usuario);

      navigate("/dashboard");
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="auth-bg d-flex align-items-center justify-content-center">
      <div className="login-card">
        <div className="text-center mb-3">
          <img
            src="/images/logo.jpg"
            alt="Logo"
            className="app-logo mb-2"
          />
        </div>

        <h4 className="mb-4 text-center">Iniciar sesión</h4>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              className="form-control"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
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

        <div className="text-center mt-2">
          <Link to="/" className="btn btn-link p-0">
            ← Volver al inicio
          </Link>
        </div>

        <p className="mt-3 text-center mb-0">
          ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

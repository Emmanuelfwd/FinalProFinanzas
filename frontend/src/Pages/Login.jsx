// frontend/src/Pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
          correo,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { token, refresh, usuario } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("currentUser", JSON.stringify(usuario));
      localStorage.setItem("userId", usuario.id_usuario);

      navigate("/dashboard");
    } catch (err) {
      console.error("Error login:", err);
      if (err.response?.status === 401) {
        setError("Credenciales inválidas");
      } else {
        setError("Error al iniciar sesión.");
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <h2 className="mb-4 text-center">Iniciar sesión</h2>

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

          <p className="mt-3 text-center">
            ¿No tienes cuenta?{" "}
            <Link to="/register">Crear cuenta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

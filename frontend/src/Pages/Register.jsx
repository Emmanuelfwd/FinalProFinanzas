import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/visual.css";

function Register() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/usuarios/",
        {
          nombre,
          correo,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      navigate("/login");
    } catch (err) {
      setError("Error al crear la cuenta");
    }
  };

  return (
    <div className="auth-bg d-flex align-items-center justify-content-center">
      <div className="login-card">
        {/* LOGO */}
        <div className="text-center mb-3">
          <img
            src="/images/logo.jpg"
            alt="EasyWallet"
            className="app-logo mb-2"
          />
        </div>

        <h4 className="mb-2 text-center">Crear cuenta</h4>
        <p className="text-center text-muted mb-4">
          Únete a EasyWallet en segundos.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
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
            Registrarse
          </button>
        </form>

        <p className="mt-3 text-center mb-0">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

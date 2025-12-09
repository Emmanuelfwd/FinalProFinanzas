import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");

    try {
      // Crea un usuario en AuthUsuario
      await axios.post("http://127.0.0.1:8000/api/usuarios/", {
        nombre,
        correo,
        contrasenha_hash: password, // para demo; idealmente deberías hashearla en backend
      });

      setOk("Cuenta creada correctamente, ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      console.error("Error registro:", err);
      setError("No se pudo crear la cuenta.");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <h1 className="mb-3 text-center">Crear cuenta</h1>
          <p className="text-muted text-center">
            Únete a EasyWallet en segundos.
          </p>

          {error && <div className="alert alert-danger">{error}</div>}
          {ok && <div className="alert alert-success">{ok}</div>}

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
              Registrarse
            </button>
          </form>

          <p className="mt-3 text-center">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {

    return (
        <div className="auth-wrapper">
            <div className="auth-card">

                <h1 className="auth-title">Crear Cuenta</h1>
                <p className="auth-subtitle">Únete a EasyWallet en segundos</p>

                <form className="auth-form">
                    <label className="auth-label">Nombre completo</label>
                    <input className="auth-input" />

                    <label className="auth-label">Correo electrónico</label>
                    <input className="auth-input" />

                    <label className="auth-label">Contraseña</label>
                    <input type="password" className="auth-input" />

                    <button className="auth-btn">Registrarse</button>
                </form>

                <div className="auth-link">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </div>
            </div>
        </div>
    );
}

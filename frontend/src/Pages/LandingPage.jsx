import React from "react";
import { Link } from "react-router-dom";
import "../styles/landing.css";

export default function LandingPage() {
    return (
        <div className="landing-wrapper">

            {/* NAV */}
            <nav className="landing-nav">
                <div className="logo">FinanzasPro</div>
                <Link to="/login" className="login-btn">Iniciar sesión</Link>
            </nav>

            {/* HERO SECTION */}
            <section className="hero">
                <h1>
                    Lleva tus finanzas al siguiente nivel
                </h1>
                <p className="subtitle">
                    Gestiona gastos, ingresos, suscripciones y visualiza tu progreso con facilidad.
                </p>

                <Link to="/login" className="primary-btn">
                    Empezar ahora
                </Link>
            </section>

            {/* FEATURES */}
            <section className="features">
                <div className="feature-card">
                    <h3>Registra tus movimientos</h3>
                    <p>Controla tus gastos e ingresos de forma ordenada y rápida.</p>
                </div>

                <div className="feature-card">
                    <h3>Reportes claros</h3>
                    <p>Obtén estadísticas detalladas y gráficas limpias.</p>
                </div>

                <div className="feature-card">
                    <h3>Interfaz sencilla</h3>
                    <p>Un diseño familiar, cómodo e intuitivo para todos.</p>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="landing-footer">
                FinanzasPro © 2025
            </footer>
        </div>
    );
}

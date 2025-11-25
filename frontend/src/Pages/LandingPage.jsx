import React from "react";
import { Link } from "react-router-dom";
import "../styles/landing.css";

export default function LandingPage() {
    return (
        <div className="landing-wrapper">
            {/* NAV */}
            <nav className="landing-nav">
                <div className="landing-logo">
                    {/* Si quieres que diga EasyWallet y no FinanzasPro cámbialo aquí */}
                    <span>EW</span>
                    EasyWallet
                </div>
                <Link to="/login" className="login-btn">
                    Iniciar sesión
                </Link>
            </nav>

            <div className="landing-container">
                {/* HERO SECTION */}
                <section className="hero">
                    <h1>Controla tus finanzas personales de forma simple</h1>
                    <p className="subtitle">
                        EasyWallet te ayuda a gestionar gastos, ingresos y suscripciones sin complicaciones.
                        Perfecto para estudiantes, padres y freelancers.
                    </p>

                    <Link to="/login" className="primary-btn">
                        Comenzar gratis
                    </Link>
                </section>

                {/* TÍTULO DE SECCIÓN */}
                <h2 className="section-title">Características principales</h2>

                {/* FEATURES */}
                <section className="features">
                    <div className="feature-card">
                        <h3>Control de Gastos</h3>
                        <p>
                            Registra y categoriza tus gastos fácilmente. Visualiza en qué gastas más cada mes.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Alertas de Suscripciones</h3>
                        <p>
                            Recibe recordatorios de próximos pagos de suscripciones. Nunca olvides un cargo.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Gráficas Intuitivas</h3>
                        <p>
                            Visualiza tus finanzas con gráficas claras y fáciles de entender.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Tipo de Cambio</h3>
                        <p>
                            Consulta el tipo de cambio en tiempo real desde APIs públicas.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Multi-usuario</h3>
                        <p>
                            Panel de administración para gestionar usuarios y permisos.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Datos Seguros</h3>
                        <p>
                            Tus datos están protegidos con las mejores prácticas de seguridad.
                        </p>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="landing-footer">
                    EasyWallet © 2025
                </footer>
            </div>
        </div>
    );
}

import React from "react";
import { Link } from "react-router-dom";
import "../styles/landing.css";

export default function LandingPage() {
  return (
    <div className="landing-page d-flex flex-column min-vh-100">
      {/* NAV */}
      <header className="landing-nav navbar navbar-expand-lg bg-light shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold">EW EasyWallet</span>
          <div className="ms-auto">
            <Link to="/login" className="btn btn-outline-primary me-2">
              Iniciar sesión
            </Link>
            <Link to="/register" className="btn btn-primary">
              Crear cuenta
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main className="flex-grow-1">
        <section className="py-5 bg-white">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-7">
                <h1 className="display-5 fw-bold mb-3">
                  Controla tus finanzas personales de forma simple
                </h1>
                <p className="lead mb-4">
                  EasyWallet te ayuda a gestionar gastos, ingresos y
                  suscripciones sin complicaciones. Perfecto para estudiantes,
                  padres y freelancers.
                </p>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Comenzar gratis
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-5 bg-light">
          <div className="container">
            <h2 className="h3 fw-bold mb-4">Características principales</h2>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h5">Control de gastos</h3>
                    <p className="mb-0">
                      Registra y categoriza tus gastos fácilmente. Visualiza en
                      qué gastas más cada mes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h5">Alertas de suscripciones</h3>
                    <p className="mb-0">
                      Recibe recordatorios de próximos pagos de suscripciones.
                      Nunca olvides un cargo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h5">Gráficas intuitivas</h3>
                    <p className="mb-0">
                      Visualiza tus finanzas con gráficas claras y fáciles de
                      entender.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h5">Tipo de cambio</h3>
                    <p className="mb-0">
                      Consulta el tipo de cambio en tiempo real desde APIs
                      públicas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h5">Multiusuario</h3>
                    <p className="mb-0">
                      Panel de administración para gestionar usuarios y
                      permisos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h5">Datos seguros</h3>
                    <p className="mb-0">
                      Tus datos están protegidos con buenas prácticas de
                      seguridad (para uso académico/local).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        EasyWallet © 2025
      </footer>
    </div>
  );
}

import { Link } from "react-router-dom";
import "../styles/landing.css";

const Landing = () => {
  return (
    <div className="landing-bg">
      {/* NAVBAR */}
      <nav className="navbar landing-navbar px-4">
        <div className="container-fluid">
          <div className="d-flex align-items-center gap-2">
            <img
              src="/images/logo.jpg"
              alt="EasyWallet"
              className="landing-logo"
            />
            <strong>EW EasyWallet</strong>
          </div>

          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-outline-primary">
              Iniciar sesión
            </Link>
            <Link to="/register" className="btn btn-primary">
              Crear cuenta
            </Link>
          </div>
        </div>
      </nav>

      {/* CONTENIDO */}
      <div className="landing-content">
        <div className="container py-5">
          {/* HERO */}
          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <h1 className="fw-bold mb-3">
                Controla tus finanzas personales de forma simple
              </h1>
              <p className="mb-4">
                EasyWallet te ayuda a gestionar gastos, ingresos y
                suscripciones sin complicaciones. Perfecto para estudiantes,
                padres y freelancers.
              </p>

              <Link to="/register" className="btn btn-primary btn-lg">
                Comenzar gratis
              </Link>
            </div>
          </div>

          {/* FEATURES */}
          <h3 className="mb-4">Características principales</h3>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5>Control de gastos</h5>
                  <p>
                    Registra y categoriza tus gastos fácilmente. Visualiza en
                    qué gastas más cada mes.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5>Alertas de suscripciones</h5>
                  <p>
                    Recibe recordatorios de próximos pagos. Nunca olvides un
                    cargo.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5>Gráficas intuitivas</h5>
                  <p>
                    Visualiza tus finanzas con gráficas claras y fáciles de
                    entender.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5>Tipo de cambio</h5>
                  <p>
                    Consulta el tipo de cambio en tiempo real desde APIs
                    públicas.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5>Multiusuario</h5>
                  <p>
                    Panel de administración para gestionar usuarios y permisos.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5>Datos seguros</h5>
                  <p>
                    Tus datos están protegidos con buenas prácticas de
                    seguridad (uso académico/local).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <footer className="text-center mt-5 py-4 border-top">
            EasyWallet © 2025
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Landing;

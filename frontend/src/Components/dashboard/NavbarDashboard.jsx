import { Link, useNavigate } from "react-router-dom";
import "../../styles/visual.css";

const NavbarDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-light bg-white border-bottom px-3">
      <div className="container-fluid">
        <Link to="/dashboard" className="navbar-brand d-flex align-items-center">
          {/* LOGO */}
          <img
            src="/images/logo.jpg"
            alt="Logo"
            className="app-logo me-2"
          />
          <strong>FinanzasApp</strong>
        </Link>

        <div className="d-flex align-items-center gap-2">
          {user?.is_admin && (
            <Link to="/admin" className="btn btn-sm btn-outline-dark">
              Admin
            </Link>
          )}

          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleLogout}
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarDashboard;

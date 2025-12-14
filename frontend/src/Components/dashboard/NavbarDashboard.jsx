import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NavbarDashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("currentUser") || "null");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-3">
      <div className="container-fluid">
        {/* LOGO / TITULO */}
        <Link className="navbar-brand fw-bold" to="/dashboard">
          FinanzasApp
        </Link>

        <div className="d-flex align-items-center gap-2">
          {/* BOTÓN ADMIN (solo admins) */}
          {user?.is_admin === true && (
            <Link
              to="/admin"
              className="btn btn-sm btn-outline-dark"
            >
              Admin
            </Link>
          )}

          {/* USUARIO */}
          {user && (
            <span className="text-muted small d-none d-md-inline">
              {user.nombre}
            </span>
          )}

          {/* LOGOUT */}
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

import React from "react";

const NavbarDashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand mb-0 h1">FinanzasPro Dashboard</span>
      <button
        className="btn btn-outline-light btn-sm"
        type="button"
        onClick={handleLogout}
      >
        Cerrar sesión
      </button>
    </nav>
  );
};

export default NavbarDashboard;

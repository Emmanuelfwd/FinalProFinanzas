import React from "react";
import { Link } from "react-router-dom";

const NavbarDashboard = () => {
    return (
        <nav className="navbar navbar-dark bg-dark px-3">
            <Link to="/dashboard" className="navbar-brand">
                FinanzasPro Dashboard
            </Link>

            <button 
                className="btn btn-outline-light"
                onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                }}
            >
                Cerrar Sesión
            </button>
        </nav>
    );
};

export default NavbarDashboard;

import React from "react";
import { NavLink } from "react-router-dom";

const SidebarDashboard = () => {
  const base = "/dashboard";

  return (
    <aside className="bg-light border-end" style={{ minWidth: "220px" }}>
      <nav className="nav flex-column p-3">
        <NavLink
          end
          to={base}
          className={({ isActive }) =>
            "nav-link" + (isActive ? " fw-bold text-primary" : "")
          }
        >
          Inicio
        </NavLink>

        <NavLink
          to={`${base}/gastos`}
          className={({ isActive }) =>
            "nav-link" + (isActive ? " fw-bold text-primary" : "")
          }
        >
          Gastos
        </NavLink>

        <NavLink
          to={`${base}/ingresos`}
          className={({ isActive }) =>
            "nav-link" + (isActive ? " fw-bold text-primary" : "")
          }
        >
          Ingresos
        </NavLink>

        <NavLink
          to={`${base}/suscripciones`}
          className={({ isActive }) =>
            "nav-link" + (isActive ? " fw-bold text-primary" : "")
          }
        >
          Suscripciones
        </NavLink>

       

        <NavLink
          to={`${base}/historial`}
          className={({ isActive }) =>
            "nav-link" + (isActive ? " fw-bold text-primary" : "")
          }
        >
          Historial
        </NavLink>
      </nav>
    </aside>
  );
};

export default SidebarDashboard;
